import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Grid, Loader } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityList from "./ActivityList";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/Pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceHolder from "./ActivityListItemPlaceHolder";

const ActivityDashboard = () => {
  const { activityStore } = useStore();
  const { loadActivities, activityRepository, setPagingParams, pagination } =
    activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    if (activityStore.activityRepository.size === 0) {
      activityStore.loadActivities();
    }
  }, [
    activityStore.loadActivities,
    activityStore.activityRepository.size,
    activityStore,
  ]);

  // if (activityStore.loadingInitial && !loadingNext) {
  //   return (
  //     <LoadingComponent content="Loading Activities..."></LoadingComponent>
  //   );
  // }
  return (
    <Grid>
      <Grid.Column width="10">
        {activityStore.loadingInitial && !loadingNext ? (
        <>
          <ActivityListItemPlaceHolder />
          <ActivityListItemPlaceHolder />
        </>
        ):(
        <InfiniteScroll
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={
            !loadingNext &&
            !!pagination &&
            pagination.currentPage < pagination.totalPages
          }
          initialLoad={false}
        >
          <ActivityList />
        </InfiniteScroll>
        )}
        {/* <Button
        floated='right'
        content='More...'
        positive
        onClick={handleGetNext}
        loading={loadingNext}
        disabled = {pagination?.totalPages === pagination?.currentPage} /> */}
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width="10">
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
