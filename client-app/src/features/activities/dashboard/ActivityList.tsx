import { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  activities: Activity[];
  selectActivity: (id: string) => void;
  DeleteActivity: (id: string) => void;
  Submitting: boolean;
}



const ActivityList = ({
  activities,
  selectActivity,
  DeleteActivity,
  Submitting,
}: Props) => {

  const [target,setTarget]=useState('');
  const DeleteHandler = (e:SyntheticEvent<HTMLButtonElement>, name:string) => {
    setTarget(e.currentTarget.name);
    DeleteActivity(name);
  }
  return (
    <Segment>
      <Item.Group divided>
        {activities.map((act) => (
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
                <Button
                  floated="right"
                  content="View"
                  color="blue"
                  onClick={() => {
                    selectActivity(act.id);
                  }}
                />
                <Button
                  floated="right"
                  content="Delete"
                  color="red"
                  onClick={(e)=>DeleteHandler(e,act.id)}
                  loading={Submitting && target===act.id}
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
export default ActivityList;
