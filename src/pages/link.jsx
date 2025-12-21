import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Use current origin for short URL display (frontend URL)
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

const LinkPage = () => {
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

  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();
  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-4xl font-extrabold ">
            Title:{" "}
            <span className="hover:underline cursor-pointer">{url?.title}</span>
          </span>
          <div className="flex flex-wrap items-center gap-2 text-1xl sm:text-2xl font-bold">
            <span>Shortner Link:</span>
            <a
              href={`${BASE_URL}/${link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline cursor-pointer break-all"
            >
              {BASE_URL}/{link}
            </a>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span>Original Link:</span>
            <a
              href={url?.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline cursor-pointer text-blue-500 break-all"
            >
              {url?.original_url}
            </a>
          </div>

          <span className="flex items-end font-extralight text-sm">
            Created At:{" "}
            <span className="ml-1">
              {new Date(url?.created_at).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </span>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${BASE_URL}/${link}`
                )
              }
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImage}>
              <Download />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center"
                  disabled={loadingDelete}
                >
                  {loadingDelete ? (
                    <BeatLoader size={5} color="white" />
                  ) : (
                    <Trash />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900">
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this link? This action cannot
                  be undone.
                </p>
                <DialogFooter>
                  <DialogTrigger asChild>
                    <Button className="text-gray-500" variant="outline">
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      fnDelete().then(() => {
                        navigate("/dashboard");
                      })
                    }
                    disabled={loadingDelete}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <img
            src={url?.qr}
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default LinkPage;
