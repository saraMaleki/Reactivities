import { Activity } from "../../../app/models/activity";
import { Segment, List, Label, Item, Image } from 'semantic-ui-react'

interface Props {
    activity: Activity;
}

const ActivityDetailedSidebar = ({ activity }: Props) => {
    return(
        <>
        <Segment
            textAlign='center'
            style={{ border: 'none' }}
            attached='top'
            secondary
            inverted
            color='teal'
        >
            {/* {attendees.length} {attendees.length === 1 ? 'Person' : 'People'} going */}
        </Segment>
        <Segment attached>
            <List relaxed divided>
                {/* {attendees.map(attendee => ( */}
                    {/* <Item style={{ position: 'relative' }} key={attendee.username}> */}
                    <Item style={{ position: 'relative' }} >
                        {/* {attendee.username === host?.username && */}
                            <Label
                                style={{ position: 'absolute' }}
                                color='orange'
                                ribbon='right'
                            >
                                Host
                            </Label>
                            {/* } */}
                            {/* <Image size='tiny' src={attendee.image || '/assets/user.png'} /> */}
                        <Image size='tiny' src='/assets/user.png' />
                        <Item.Content verticalAlign='middle'>
                            <Item.Header as='h3'>
                                {/* <Link to={`/profiles/${attendee.username}`}>{attendee.displayName}</Link> */}
                            </Item.Header>
                            {/* {attendee.following && */}
                            <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
                            {/* } */}
                        </Item.Content>
                    </Item>
                {/* )) */}
                {/* } */}

            </List>
        </Segment>
    </>
    );
}
export default ActivityDetailedSidebar;