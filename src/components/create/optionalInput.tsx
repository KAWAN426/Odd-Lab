import styled from "styled-components"
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { checkImageURL, resizeImage } from "../../lib/image";
import { useStore } from "../../zustand/store";
import { IImgData } from "../../types/data";

interface IDataInputProps {
  title: string,
  defaultImg: string,
  imageChange: (file: File) => Promise<{
    changedImg: Blob;
    url: string;
  }>,
  setData: Dispatch<SetStateAction<IImgData>>,
  styles: Object
}

export default function OptionalInput({ title, defaultImg, imageChange, setData, styles }: IDataInputProps) {
  const [imgType, setImgType] = useState<"file" | "url">("file")
  const [URLInput, setURLInput] = useState("")
  const [imgURL, setImgURL] = useState(defaultImg)

  const handleChangeURL = async (url: string) => {
    const result = await checkImageURL(url)
    if (result) {
      setImgURL(url);
      setData({ url });
    } else {
      setURLInput("");
      setImgURL(defaultImg);
      setData({ url: defaultImg });
    };
  };
  const handleFileChange = async (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement
    const files = input.files;
    if (!files) return;
    const { changedImg, url } = await imageChange(files[0])
    setImgURL(url)
    const newFormData = new FormData();
    newFormData.append('file', changedImg);
    setData({ url, form: newFormData })
    setURLInput(url);
  }

  return (
    <>
      <OptionWrap>
        <h2>{title}</h2>
        <NewImgOption>
          <label htmlFor={`optionFile${title}`}>FILE</label>
          <input checked={imgType === "file"} onChange={() => setImgType("file")} id={`optionFile${title}`} type="radio" />
          <label htmlFor={`optionURL${title}`}>URL</label>
          <input checked={imgType === "url"} onChange={() => setImgType("url")} id={`optionURL${title}`} type="radio" />
        </NewImgOption>
      </OptionWrap>
      {
        imgType === "file" ?
          <MainInputLabel style={styles} htmlFor={`modalInput${title}`}>
            <h1>{imgURL}</h1>
          </MainInputLabel>
          : <input
            type="text"
            value={URLInput}
            onChange={(e) => setURLInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? handleChangeURL((e.target as HTMLInputElement).value) : null}
            onBlur={(e) => { handleChangeURL(e.target.value) }}
          />
      }
      <input
        type="file"
        id={`modalInput${title}`}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </>
  )
}

const MainInput = styled.div`
  display:flex;
  flex-direction: column;
  padding: 0px;
  padding-bottom: 10px;
  flex:1;
  overflow: hidden;
  h2{
    color:#F1F6F9;
    font-size: 14px;
    margin-right: 8px;
  }
  input{
    color:#F1F6F9;
    border:none;
    background-color: #545c6b;
    border-radius: 4px;
    flex:1;
    padding: 12px 16px;
    font-size: 18px;
  }
`
const OptionWrap = styled.div`
  display:flex;
  justify-content: space-between;
`
const MainInputLabel = styled.label`
  border:none;
  background-color: #545c6b;
  border-radius: 4px;
  flex:1;
  padding: 13.6px 16px;
  &::-webkit-scrollbar {
    display: none;
  }
  h1{
    color:#F1F6F9;
    font-size: 18px;
    /* height:18px; */
    overflow: hidden;
  }
`
const NewImgOption = styled.div`
  display:flex;
  align-items: center;
  input{
    margin:0px;
  }
  label{
    margin-left: 12px;
    padding-right: 2px;
    font-size: 12px;
    color:#F1F6F9;
  }
`