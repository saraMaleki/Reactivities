import { Grid, List } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
  activities: Activity[];
  selectedActivity: Activity | undefined;
  selectActivity: (id: string) => void;
  cancelSelectActivity: () => void;
  editMode: boolean;
  CloseForm: () => void;
  OpenForm: (id: string) => void;
  EditOrCreate : (activity : Activity) => void;
  DeleteActivity : (id: string) => void;
  Submitting:boolean;
}
const ActivityDashboard = ({
  activities,
  selectedActivity,
  cancelSelectActivity,
  selectActivity,
  editMode,
  CloseForm,
  OpenForm,
  EditOrCreate,
  DeleteActivity,
  Submitting
}: Props) => {
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList activities={activities} selectActivity={selectActivity} DeleteActivity={DeleteActivity} Submitting={Submitting}/>
      </Grid.Column>
      <Grid.Column width="6">
        {selectedActivity && !editMode && (
          <ActivityDetails
            activitiy={selectedActivity}
            cancelSelectActivity={cancelSelectActivity}
            openForm={OpenForm}
          />
        )}
        {editMode && <ActivityForm CloseForm={CloseForm} activity={selectedActivity} EditOrCreate={EditOrCreate} Submitting={Submitting}/>}
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
