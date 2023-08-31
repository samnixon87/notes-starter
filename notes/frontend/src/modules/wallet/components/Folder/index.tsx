import Note from "../Note";
import AddNote from "../AddNote";
import { useState, useRef, useEffect } from "react";
import { FolderStyle, Title, Container } from "./styles";
import { useSpring } from "react-spring";
import { INote } from "../../interfaces";
import { useApi } from "../../hooks/useApi";

interface IProps {
  title: string;
  id: string;
}

const Folder: React.FC<IProps> = ({ title, id }) => {
  const { notes, fetchNotes } = useApi();

  const [openFolder, setOpenFolder] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const [folderHeight, setFolderHeight] = useState(50);
  const [noteHeight, setNoteHeight] = useState(100);
  const [openAddNote, setOpenAddNote] = useState(false);

  const [noteIsAdded, setNoteIsAdded] = useState(false);

  const folderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (id) {
      fetchNotes(id)
    }
  }, [noteIsAdded]);

  useEffect(() => {
    setFolderHeight(openFolder ? folderRef.current!.scrollHeight + 50 : 75);
  }, [openFolder, openNote, openAddNote, notes]);

  const handleToggle = () => {
    setOpenFolder(!openFolder);
  };

  const folderProps = useSpring({
    maxHeight: folderHeight,
    config: { duration: 300, tension: 10, friction: 10 },
  });

  return (
    <>
      <FolderStyle
        ref={folderRef}
        aria-expanded={openFolder}
        aria-label={title + " folder"}
        style={folderProps}
      >
        <Container>
          <Title onClick={handleToggle} aria-label={`Toggle ${title} folder`}>
            {title}
          </Title>
          <AddNote
            openAddNote={openAddNote}
            setOpenAddNote={setOpenAddNote}
            folder={id}
            setNoteIsAdded={setNoteIsAdded}
          />
          {notes &&
            notes.map((note: any, key: number) => (
              <Note
                key={key}
                folder={title}
                openNote={openNote}
                setOpenNote={setOpenNote}
                noteHeight={noteHeight}
                setNoteHeight={setNoteHeight}
                noteTitle={note.title}
                noteBody={note.content}
              />
            ))}
        </Container>
      </FolderStyle>
    </>
  );
};

export default Folder;
