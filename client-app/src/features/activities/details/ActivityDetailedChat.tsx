import { Link } from "react-router-dom";
import { Comment, Header, Segment } from "semantic-ui-react";

interface Props {
  activityId: string;
}

const ActivityDetailedChat = ({ activityId }: Props) => (
  <>
    <Segment
      textAlign="center"
      attached="top"
      inverted
      color="teal"
      style={{ border: "none" }}
    >
      <Header>Chat about this event</Header>
    </Segment>
    <Segment attached clearing>
      <Comment.Group>
        <Comment key="comment.id">
          <Comment.Avatar src={"/assets/user.png"} />
          <Comment.Content>
            <Comment.Author as={Link} to={`/profiles/$"comment.username"`}>
              comment.displayName
            </Comment.Author>
            <Comment.Metadata>
              <div>ago</div>
            </Comment.Metadata>
            <Comment.Text style={{ whiteSpace: "pre-wrap" }}>
              comment.body
            </Comment.Text>
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </Segment>
  </>
);
export default ActivityDetailedChat;
