import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Header} from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";

const ActivityList = () => {
  const { activityStore } = useStore();
  return (
    <>
      {activityStore.groupedActivities.map(([group, activities]) => {
        return (
          <Fragment key={group}>
            <Header sub color="teal">
              {group}
            </Header>

            {activities.map((act) => (
              <ActivityListItem key={act.id} activity={act} />
            ))}
          </Fragment>
        );
      })}
    </>
  );
};
export default observer(ActivityList);
