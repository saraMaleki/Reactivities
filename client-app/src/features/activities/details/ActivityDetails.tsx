import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";

const ActivityDetails = () => {
  const { activityStore } = useStore();
  const {
    selectedActivity: activitiy,
    loadActivitiy,
    loadingInitial,
  } = activityStore;

  const { id } = useParams<{ id: string }>();

  console.log("in detail");
  console.log(id);
  console.log("activity");
  console.log(activitiy?.id);

  useEffect(() => {
    if(id) loadActivitiy(id);
  }, [id, loadActivitiy]);

  if (loadingInitial || !activitiy) return <LoadingComponent />;
  return (
    <Card fluid>
      <Image src={`/assets/categoryImages/${activitiy.category}.jpg`} />
      <Card.Content>
        <Card.Header>{activitiy.title}</Card.Header>
        <Card.Meta>
          <span className="date">{activitiy.date}</span>
        </Card.Meta>
        <Card.Description>{activitiy.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group>
          <Button as={Link} to={`/manage/${activitiy.id}`} content="Edit" color="blue" basic />
          <Button as={Link} to="/activities" content="Cancel" color="grey" basic />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};
export default observer(ActivityDetails) ;
