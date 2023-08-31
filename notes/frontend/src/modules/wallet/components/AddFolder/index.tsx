import { FolderStyle, Title, Input, Form, Button } from "./styles";
import { useState } from "react";
import { Formik, FormikHelpers } from "formik";
import { useSpring } from "react-spring";
import { useApi} from '../../hooks/useApi'

interface IProps {
  setFolderIsAdded: React.Dispatch<React.SetStateAction<boolean>>
}

const AddFolder:React.FC<IProps> = ({setFolderIsAdded}) => {

  const { createFolder } = useApi();
  const [openAddFolder, setOpenAddFolder] = useState(false);

  const addFolderProps = useSpring({
    maxHeight: openAddFolder ? 1000 : 70,
    config: openAddFolder
      ? { duration: 300, tension: 10, friction: 10 }
      : { duration: 400, tension: 10, friction: 10 },
  });

  interface FormValues {
    title: string;
  }

  const handleSubmit = (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    setTimeout(async() => {
      handleToggle();
      await createFolder( {name: values.title})
      setSubmitting(false);
      setFolderIsAdded(true)
      resetForm();
    }, 400);
  };

  const handleToggle = () => {
    setOpenAddFolder(!openAddFolder);
  };

  return (
    <>
      <FolderStyle style={addFolderProps}>
        <Title onClick={handleToggle}>+ Add folder</Title>
        <Formik
          initialValues={{ title: " " }}
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
              <Input
                type="text"
                name="title"
                onChange={handleChange}
                value={values.title}
                placeholder="Folder title"
              />
              <Button type="submit"></Button>
            </Form>
          )}
        </Formik>
      </FolderStyle>
    </>
  );
};

export default AddFolder;
