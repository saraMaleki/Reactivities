import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";


const ActivityList = () => {
  const { activityStore } = useStore();

  const [target,setTarget]=useState('');
  const DeleteHandler = (e:SyntheticEvent<HTMLButtonElement>, name:string) => {
    setTarget(e.currentTarget.name);
    // DeleteActivity(name);
    activityStore.deleteActivity(name);
  }
  return (
    <Segment>
      <Item.Group divided>
        {activityStore.activityByDate.map((act) => (
          <Item key={act.id}>
            <Item.Content>
              <Item.Header as="a">{act.title}</Item.Header>
              <Item.Meta>{act.date}</Item.Meta>
              <Item.Description>
                <div>{act.description}</div>
                <div>
                  {act.city},{act.venue}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button as={Link}
                  floated="right"
                  content="View"
                  color="blue"
                  // onClick={() => {
                  //   activityStore.selectActivity(act.id);
                  // }}
                  to={`/activities/${act.id}`}
                />
                <Button
                  floated="right"
                  content="Delete"
                  color="red"
                  onClick={(e)=>DeleteHandler(e,act.id)}
                  loading={activityStore.loading && target===act.id}
                  name={act.id}
                />
                <Label basic content={act.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};
export default observer(ActivityList);
