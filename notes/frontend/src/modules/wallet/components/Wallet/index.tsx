import { FolderContainer } from "./styles";
import Folder from "../Folder";
import AddFolder from "../AddFolder";
import { IFolder } from "../../interfaces";
import { useState, useEffect } from "react";
import { useApi} from '../../hooks/useApi'

const Wallet: React.FC = () => {

  const { folders, fetchFolders } = useApi()
  const [folderIsAdded, setFolderIsAdded] = useState(false);

  useEffect(() => {
    fetchFolders()
  }, [folderIsAdded])

  return (
    <>
      <FolderContainer>
        {folders!.map((folder: IFolder, index: number) => (
          <Folder key={index} title={folder.name} id={folder._id}/>
        ))}
        <AddFolder setFolderIsAdded={setFolderIsAdded}/>
      </FolderContainer>
    </>
  );
};

export default Wallet;
