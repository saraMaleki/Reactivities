import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

const NotFound = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="search" />
        Oops , Could not find
      </Header>
      <Segment.Inline>
        <Button as={Link} to="/activities" primary>
          Return to activity list
        </Button>
      </Segment.Inline>
    </Segment>
  );
};

export default NotFound;
