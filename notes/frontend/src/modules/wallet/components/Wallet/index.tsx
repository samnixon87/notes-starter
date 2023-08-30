import { FolderContainer } from "./styles";
import Folder from "../Folder";
import AddFolder from "../AddFolder";
import { useState, useEffect } from "react";
import { IFolder } from "../../interfaces";

const Wallet: React.FC = () => {
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [folderIsAdded, setFolderIsAdded] = useState(false)

  useEffect(() => {
    const folderList: string[] = Object.keys({ ...localStorage });
    if (folderList) {
      const folderObjects: IFolderhi[] = folderList.map((folderName) => ({
        name: folderName
      }));
      setFolders(folderObjects)
    }
  },[folderIsAdded]);

  return (
    <>
      <FolderContainer>
        {folders!.map((folder: IFolder, index: number) => (
          <Folder key={folder.name} title={folder.name}/>
        ))}
        <AddFolder setFolderIsAdded={setFolderIsAdded}/>
      </FolderContainer>
    </>
  );
};

export default Wallet;
