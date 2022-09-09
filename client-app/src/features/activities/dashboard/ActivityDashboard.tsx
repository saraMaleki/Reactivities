import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Grid, List } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const ActivityDashboard = () => {
  const { activityStore } = useStore();
  useEffect(() => {
    if(activityStore.activityRepository.size===0)
    {activityStore.loadActivities();}
  }, [activityStore.loadActivities,activityStore.activityRepository.size]);

  if (activityStore.loadingInitial) {
    return <LoadingComponent content="Loading App..."></LoadingComponent>;
  }
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        <h1> filter activity</h1>
        {/* {activityStore.selectedActivity && !activityStore.editMode && (
          <ActivityDetails />
        )}
        {activityStore.editMode && (
          <ActivityForm EditOrCreate={EditOrCreate} Submitting={loading} />
        )} */}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
