import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from "uuid";
import { format } from 'date-fns';

class ActivityStore {
  constructor() {
    makeAutoObservable(this);
  }

  get activityByDate() {
    return Array.from(this.activityRepository.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }
  get groupedActivities(){
    return Object.entries(
      this.activityByDate.reduce((activities, activity)=>{
        const date =format(activity.date!, 'dd MMM yyyy');
        activities[date] = activities[date] ? [...activities[date],activity] : [activity];
        return activities;
      },{} as {[key:string] : Activity[] })
      )
  }

  //activities: Activity[] = [];
  activityRepository = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  loadActivities = async () => {
    this.setLoadingInitial(true);
    try {
      const activities = await agent.Activities.list();
      activities.forEach((act) => {
        this.setActivity(act);
        // act.date = act.date.split("T")[0];
        // this.activityRepository.set(act.id, act);
        // this.activities.push(act);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };
  loadActivitiy = async (id: string) => {
    this.setLoadingInitial(true);
    let activity = this.getActivity(id);
    
    if (activity) {
      this.selectedActivity = activity;
      this.setLoadingInitial(false);
      return activity;
    } else {
      try {
        let activity = await agent.Activities.details(id);
        this.setActivity(activity);
        this.setLoadingInitial(false);
        this.selectedActivity = activity;
        return activity;
      } catch (error) {
        this.setLoadingInitial(false);
        console.log(error);
      }
    }
  };

  private setActivity = (activity: Activity) => {
    activity.date = new Date(activity.date!);
    this.activityRepository.set(activity.id, activity);
  };
  private getActivity = (id: string) => {
    return this.activityRepository.get(id);
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  // selectActivity = (id: string) => {
  //   // this.selectedActivity = this.activities.find((act) => act.id === id);
  //   this.selectedActivity = this.activityRepository.get(id);
  // };
  // cancelSelectActivity = () => {
  //   this.selectedActivity = undefined;
  // };
  // openForm = (id?: string) => {
  //   id ? this.selectActivity(id) : this.cancelSelectActivity();
  //   this.editMode = true;
  // };
  // closeForm = () => {
  //   this.editMode = false;
  // };

  EditOrCreate = async (activity: Activity) => {
    this.loading = true;
    if (activity.id) {
      try {
        await agent.Activities.update(activity);
        // this.activities = [
        //   ...this.activities.filter((act) => act.id !== activity.id),
        //   activity,
        // ];
        this.activityRepository.set(activity.id, activity);
        runInAction(() => {
          this.editMode = false;
          this.selectedActivity = activity;
          this.loading = false;
        });
      } catch (error) {
        console.log(error);
        runInAction(() => {
          this.loading = false;
        });
      }
    } else {
      activity.id = uuid();
      try {
        await agent.Activities.create(activity);

        runInAction(() => {
          // this.activities.push(activity);
          this.activityRepository.set(activity.id, activity);
          this.editMode = false;
          this.selectedActivity = activity;
          this.loading = false;
          console.log("new in store");
          console.log(activity.id);
        });
      } catch (error) {
        console.log(error);
        runInAction(() => {
          this.loading = false;
        })
        
      }
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRepository.delete(id);
        // this.activities = this.activities.filter((act) => act.id !== id);
        this.loading = false;
      });

      if (this.selectedActivity && this.selectedActivity.id === id) {
        this.editMode = false;
        this.selectedActivity = undefined;
      }
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
export default ActivityStore;
