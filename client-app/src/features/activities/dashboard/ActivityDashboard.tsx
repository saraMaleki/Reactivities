import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityList from "./ActivityList";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";

const ActivityDashboard = () => {
  const { activityStore } = useStore();
  useEffect(() => {
    if(activityStore.activityRepository.size===0)
    {activityStore.loadActivities();}
  }, [activityStore.loadActivities,activityStore.activityRepository.size,activityStore]);

  if (activityStore.loadingInitial) {
    return <LoadingComponent content="Loading Activities..."></LoadingComponent>;
  }
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
