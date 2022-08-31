import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";

import { Container, Header, List } from "semantic-ui-react";
import { Activity } from "../models/activity";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { v4 as uuid } from "uuid";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >();
  const [editMode, setEditMode] = useState<boolean>(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const selectActivityHandler = (id: string) => {
    setSelectedActivity(activities.find((ac) => ac.id === id));
  };
  const cancelSelectActivityHandler = () => {
    setSelectedActivity(undefined);
  };
  const openFormHandler = (id?: string) => {
    id ? selectActivityHandler(id) : cancelSelectActivityHandler();
    setEditMode(true);
  };
  const closeFormHandler = () => {
    setEditMode(false);
  };
  const EditOrCreateHandler = (activity: Activity) => {
    setSubmitting(true);
    if (activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([
          ...activities.filter((act) => act.id !== activity.id),
          activity,
        ]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      });
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      });
    }
  };
  const DeleteActivityHandler = (id: string) => {
    setSubmitting(true);

    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter((act) => act.id !== id)]);
      setSubmitting(false);
      // if (selectedActivity && selectedActivity.id === id) {
      //   setEditMode(false);
      //   setSelectedActivity(undefined);
        
      // }
    });
  };

  useEffect(() => {
    //axios
    //.get<Activity[]>("http://localhost:5000/api/activities")
    // .then((response) => {
    //   setActivities(response.data);
    // });
    agent.Activities.list().then((response) => {
      let activities: Activity[] = [];
      response.forEach((act) => {
        act.date = act.date.split("T")[0];
        activities.push(act);
      });

      setActivities(activities);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingComponent content="Loading App..."></LoadingComponent>;
  }
  return (
    <Fragment>
      <NavBar openForm={openFormHandler} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={selectActivityHandler}
          cancelSelectActivity={cancelSelectActivityHandler}
          editMode={editMode}
          OpenForm={openFormHandler}
          CloseForm={closeFormHandler}
          EditOrCreate={EditOrCreateHandler}
          DeleteActivity={DeleteActivityHandler}
          Submitting={submitting}
        />
        {/* <List>
          {activities.map((act) => (
            <List.Item key={act.id}>{act.title}</List.Item>
          ))}
        </List> */}
      </Container>
    </Fragment>
  );
}

export default App;
