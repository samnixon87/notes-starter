import { useRef, useState, useEffect } from "react";
import { Add, Title, TitleInput, BodyInput, Form, Button } from "./styles";
import { Formik, FormikHelpers } from "formik";
import { useSpring } from "react-spring";

interface IProps {
  openAddNote: boolean;
  setOpenAddNote: React.Dispatch<React.SetStateAction<boolean>>;
  folder: string;
  setNoteIsAdded: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNote: React.FC<IProps> = ({ openAddNote, setOpenAddNote, folder, setNoteIsAdded }) => {
  const newNoteRef = useRef<HTMLDivElement | null>(null);
  const [noteHeight, setNoteHeight] = useState(50);

  // useEffect to set height
  useEffect(() => {
    setNoteHeight(
      newNoteRef.current
        ? openAddNote
          ? newNoteRef.current.scrollHeight
          : 40
        : 40
    );
  }, [openAddNote]);

  // Types
  interface FormValues {
    title: string;
    body: string;
  }

  // Submit

  const handleSubmit = (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    setTimeout(() => {
      setSubmitting(false);
      const currentFolder = localStorage.getItem(folder);
      const notes = currentFolder ? JSON.parse(currentFolder) : [];
      const newNoteAdded = [values.title, values.body];
      notes.push(newNoteAdded);
      const updatedNotes = JSON.stringify(notes);
      localStorage.setItem(folder, updatedNotes);
      handleToggle();
      setNoteIsAdded(true)
      resetForm();
    }, 400);
  };

  // Animation props
  const addNoteProps = useSpring({
    maxHeight: noteHeight,
    config: openAddNote
      ? { duration: 300, tension: 10, friction: 10 }
      : { duration: 400, tension: 10, friction: 10 },
  });

  // Toggle
  const handleToggle = () => {
    setOpenAddNote(!openAddNote);
  };

  return (
    <>
      <Add ref={newNoteRef} style={addNoteProps}>
        <Title onClick={handleToggle}>+ Add note</Title>
        {openAddNote && (
          <Formik
            initialValues={{ title: " ", body: " " }}
            validate={(values) => {
              const errors: Partial<FormValues> = {};
              if (!values.title) {
                errors.title = "Title is required";
              }
              return errors;
            }}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <TitleInput
                  type="text"
                  name="title"
                  onChange={handleChange}
                  value={values.title}
                  placeholder="Note title"
                />
                <BodyInput
                  type="textarea"
                  name="body"
                  onChange={handleChange}
                  value={values.body}
                  placeholder="Type something..."
                />
                <Button type="submit"></Button>
              </Form>
            )}
          </Formik>
        )}
      </Add>
    </>
  );
};

export default AddNote;
