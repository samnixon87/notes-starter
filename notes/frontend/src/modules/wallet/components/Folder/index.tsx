import Note from "../Note";
import AddNote from "../AddNote";
import { useState, useRef, useEffect } from "react";
import { FolderStyle, Title, Container } from "./styles";
import { useSpring } from "react-spring";
import { INote } from "../../interfaces";

interface IProps {
  title: string;
}

const Folder: React.FC<IProps> = ({ title }) => {
  const [openFolder, setOpenFolder] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const [folderHeight, setFolderHeight] = useState(50);
  const [noteHeight, setNoteHeight] = useState(100);
  const [openAddNote, setOpenAddNote] = useState(false);
  const [notes, setNotes] = useState<INote[]>([]);
  const [noteIsAdded, setNoteIsAdded] = useState(false);

  const folderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedNotes = localStorage.getItem(title);
    if (storedNotes !== null && storedNotes !== "") {
      const noteList = JSON.parse(storedNotes);
      if (notes === null || noteList.length > notes.length) {
        setNotes(noteList);
      }
    }
  }, [title, noteIsAdded, notes]);

  useEffect(() => {
    setFolderHeight(openFolder ? folderRef.current!.scrollHeight + 150 : 75);
  }, [openFolder, openNote, openAddNote]);

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
            folder={title}
            setNoteIsAdded={setNoteIsAdded}
          />
          {notes &&
            Object.values(notes).map((note: any, key: number) => (
              <Note
                key={key}
                folder={title}
                openNote={openNote}
                setOpenNote={setOpenNote}
                noteHeight={noteHeight}
                setNoteHeight={setNoteHeight}
                noteTitle={note[0]}
                noteBody={note[1]}
              />
            ))}
        </Container>
      </FolderStyle>
    </>
  );
};

export default Folder;
