import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";

interface Props {
  activity: Activity | undefined;
  CloseForm: () => void;
  EditOrCreate: (activity: Activity) => void;
  Submitting :boolean;
}

const ActivityForm = ({ CloseForm, activity: selectedActivity, EditOrCreate,Submitting }: Props) => {
  const initialState = selectedActivity ?? {
    id: "",
    title: "",
    date: "",
    description: "",
    category: "",
    city: "",
    venue: "",
  };
  const [activity, setActivity] = useState(initialState);

  const changeInputHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = event.target;
    setActivity({ ...activity, [name]: value });
  };

  const submitHandler = (event : FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(activity);
    EditOrCreate(activity);
  };
  return (
    <Segment clearing>
      <Form onSubmit={submitHandler} autocomplete='off'>
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
          loading={Submitting}
        />
        <Button
          type="button"
          content="Cancel"
          floated="right"
          onClick={CloseForm}
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
