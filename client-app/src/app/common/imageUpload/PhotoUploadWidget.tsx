import { useEffect, useState } from "react";
import { Cropper } from "react-cropper";
import { Button, Grid, Header, Image } from "semantic-ui-react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import PhotoWidgetDropZone from "./PhotoWidgetDropZone";

interface Props{
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}
const PhotoUpoadWidget = ({loading,uploadPhoto} : Props) => {
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  const onCrop = () => {
   
    if (cropper) {
        console.log("on crop");
      cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
    }
  };

  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color="orange" content="Step 1 - Add Photo" />
        <PhotoWidgetDropZone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="orange" content="Step 2 - Resize Image" />
        {files && files.length > 0 && (
          <PhotoWidgetCropper
            setCropper={setCropper}
            imagePreview={files[0].preview}
          />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header sub color="orange" content="Step 3 - Preview & Upload" />
        {files && files.length>0 &&  
        <>
        <div
          className="img-preview"
          style={{ minHeight: 200, overflow: "hidden" }}
        />
        <Button.Group widths={2}>
          <Button loading={loading} onClick={onCrop} positive icon="check" />
          <Button disabled={loading} onClick={() => setFiles([])} icon="close" />
        </Button.Group>
      </>
       }
        
      </Grid.Column>
    </Grid>
  );
};

export default PhotoUpoadWidget;
