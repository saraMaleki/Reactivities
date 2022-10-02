import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

class ActivityStore {
  constructor() {
    makeAutoObservable(this);
  }

  get activityByDate() {
    return Array.from(this.activityRepository.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }
  get groupedActivities() {
    return Object.entries(
      this.activityByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMM yyyy");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
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
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees?.some(
        (u) => u.username === user.username
      );
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(
        (u) => u.username === activity.hostUsername
      );
    }
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

  EditOrCreate = async (activity: ActivityFormValues) => {
    if (activity.id) {
      try {
        await agent.Activities.update(activity);
        runInAction(() => {
          if (activity.id) {
            let UpdatedActivity = {
              ...this.getActivity(activity.id),
              ...activity,
            };
            this.activityRepository.set(
              activity.id,
              UpdatedActivity as Activity
            );
            this.selectedActivity = UpdatedActivity as Activity;
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      const user = store.userStore.user;
      const attendee = new Profile(user!);

      activity.id = uuid();
      try {
        await agent.Activities.create(activity);
        const newActivity = new Activity(activity);
        newActivity.hostUsername = user!.username;
        newActivity.attendees = [attendee];
        this.setActivity(newActivity);
        runInAction(() => {
          this.selectedActivity = newActivity;
        });
      } catch (error) {
        console.log(error);
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
  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (u) => u.username !== user!.username
            );
          this.selectedActivity.isGoing = false;
          console.log(this.selectedActivity!.isGoing);
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
          console.log(this.selectedActivity!.isGoing);
        }
        this.activityRepository.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled =
          !this.selectedActivity?.isCancelled;
        this.activityRepository.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };
  clearSelectedActivity =()=>{
    this.selectedActivity= undefined;
  }
}
export default ActivityStore;
