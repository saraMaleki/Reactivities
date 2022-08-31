import { Button, Card, Image } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
    activitiy : Activity;
    cancelSelectActivity : ()=>void;
    openForm : (id : string) => void;
}

const ActivityDetails = ({activitiy,cancelSelectActivity,openForm} : Props) => {

    return(
        <Card fluid>
        <Image src={`/assets/categoryImages/${activitiy.category}.jpg`} />
        <Card.Content>
          <Card.Header>{activitiy.title}</Card.Header>
          <Card.Meta>
            <span className='date'>{activitiy.date}</span>
          </Card.Meta>
          <Card.Description>
           {activitiy.description}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
         <Button.Group>
            <Button content="Edit" color="blue" basic onClick={() => openForm(activitiy.id)}/>
            <Button content="Cancel" color="grey" basic onClick={cancelSelectActivity}/>
         </Button.Group>
        </Card.Content>
      </Card>
    );
}
export default ActivityDetails;