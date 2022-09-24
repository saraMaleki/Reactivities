import { Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity, ActivityFormValues } from "../../../app/models/activity";
import { useStore } from "../../../app/stores/store";
import * as Yup from "yup";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";

const ActivityForm = () => {
  const history = useHistory();
  const { activityStore } = useStore();
  const { loadActivitiy, loadingInitial } = activityStore;
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<ActivityFormValues >(new ActivityFormValues());

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    date: Yup.string().required("date is required").nullable(),
    category: Yup.string().required("category is required"),
    city: Yup.string().required("city is required"),
    venue: Yup.string().required("venue is required"),
    description: Yup.string().required("description is required"),
  });
  useEffect(() => {
    if (id) {
      // console.log("load activity");
      // console.log(id);
      loadActivitiy(id).then((activity) => setActivity(new ActivityFormValues(activity)));
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

  // const handleChange = (
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { value, name } = event.target;
  //   setActivity({ ...activity, [name]: value });
  // };

  const submitFormHandler = (activity: ActivityFormValues) => {
    //event.preventDefault();
    activityStore
      .EditOrCreate(activity)
      .then(() =>
        history.replace(`/activities/${activityStore.selectedActivity?.id}`)
      );
  };

  if (loadingInitial) return <LoadingComponent content="Loading ..." />;

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => submitFormHandler(values)}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput placeholder="Title" name="title" />
            <MyTextArea placeholder="Description" name="description" rows={2} />
            <MySelectInput
              options={categoryOptions}
              placeholder="Category"
              name="category"
            />
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
            <Header content="Location Details" sub color="teal" />

            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venu" name="venue" />
            <Button
            disabled={!isValid || isSubmitting || !dirty}
              type="submit"
              content="Submit"
              positive
              float="right"
              loading={isSubmitting}
            />
            <Button
              type="button"
              content="Cancel"
              floated="right"
              // onClick={activityStore.closeForm}
              as={Link}
              to="/activities"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ActivityForm);
