/* eslint-disable react/prop-types */
import {Copy, Download, LinkIcon, Trash} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import {deleteUrl} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const LinkCard = ({url = [], fetchUrls}) => {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, url.id);

  // Format date without seconds
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg shadow-lg">
      {/* Image Section */}
      <div className="flex justify-center md:justify-start self-center">
        <img
          src={url?.qr}
          className="h-32 w-32 md:h-40 md:w-40 object-contain ring ring-blue-500 rounded-lg"
          alt="QR code"
        />
      </div>
      {/* Info Section */}
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
        <span className="text-xl md:text-3xl font-extrabold mb-3 break-words">
          Title: <span className="hover:underline cursor-pointer">{url?.title}</span>
        </span>
        <span className="text-lg md:text-2xl font-bold mb-3 break-words">
          Short URL:{" "}
          <span className="text-blue-400 hover:underline cursor-pointer">
            https://triimrrr.netlify.app/{url?.custom_url || url.short_url}
          </span>
        </span>
        <span className="flex items-center gap-2 flex-wrap mb-3">
          <span className="font-bold">Original URL:</span>
          <span className="hover:underline cursor-pointer">{url?.original_url}</span>
        </span>
        <span className="flex items-end font-extralight text-xs md:text-sm flex-1">
          <span className="font-bold mr-1">Created at:</span> {formatDate(url?.created_at)}
        </span>
      </Link>
      {/* Action Buttons Section */}
      <div className="flex gap-2 mt-4 md:mt-0 justify-center md:justify-start">
        <Button
          variant="ghost"
          onClick={() =>
            navigator.clipboard.writeText(`https://triimrrr.netlify.app/${url?.short_url}`)
          }
          className="flex items-center justify-center"
        >
          <Copy />
        </Button>
        <Button variant="ghost" onClick={downloadImage} className="flex items-center justify-center">
          <Download />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-center"
              disabled={loadingDelete}
            >
              {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this link?
            </p>
            <DialogFooter>
              <DialogTrigger asChild>
                <Button className="text-gray-500" variant="outline">
                  Cancel
                </Button>
              </DialogTrigger>
              <Button
                variant="destructive"
                onClick={() => fnDelete().then(() => fetchUrls())}
                disabled={loadingDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LinkCard;
