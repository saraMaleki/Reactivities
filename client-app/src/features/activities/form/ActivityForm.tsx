import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";

const ActivityForm = () => {
  const history = useHistory();
  const { activityStore } = useStore();
  const { loadActivitiy, loadingInitial } = activityStore;
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    date: "",
    description: "",
    category: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (id) {
      // console.log("load activity");
      // console.log(id);
      loadActivitiy(id).then((activity) => setActivity(activity!));
    }
    // else{
    //   setActivity({
    //     id: "",
    //     title: "",
    //     date: "",
    //     description: "",
    //     category: "",
    //     city: "",
    //     venue: "",
    //   });
    // }
  }, [loadActivitiy, id]);

  const changeInputHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = event.target;
    setActivity({ ...activity, [name]: value });
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    activityStore
      .EditOrCreate(activity)
      .then(() => history.replace(`/activities/${activityStore.selectedActivity?.id}`));
  };

  if (loadingInitial) return <LoadingComponent content="Loading ..." />;

  return (
    <Segment clearing>
      <Form onSubmit={submitHandler} autoComplete="off">
        <Form.Input
          placeholder="Title"
          value={activity.title}
          name="title"
          onChange={changeInputHandler}
        />
        <Form.TextArea
          placeholder="Description"
          value={activity.description}
          name="description"
          onChange={changeInputHandler}
        />
        <Form.Input
          placeholder="Category"
          value={activity.category}
          name="category"
          onChange={changeInputHandler}
        />
        <Form.Input
          placeholder="Date"
          value={activity.date}
          name="date"
          type="date"
          onChange={changeInputHandler}
        />
        <Form.Input
          placeholder="City"
          value={activity.city}
          name="city"
          onChange={changeInputHandler}
        />
        <Form.Input
          placeholder="Venu"
          value={activity.venue}
          name="venue"
          onChange={changeInputHandler}
        />
        <Button
          type="submit"
          content="Submit"
          positive
          float="right"
          loading={activityStore.loading}
        />
        <Button
          type="button"
          content="Cancel"
          floated="right"
          // onClick={activityStore.closeForm}
          as={Link}
          to='/activities' 
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
