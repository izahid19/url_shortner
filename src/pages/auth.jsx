import Login from "@/components/login";
import Signup from "@/components/signup";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {UrlState} from "@/context";
import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

function Auth() {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {isAuthenticated, loading} = UrlState();
  const longLink = searchParams.get("createNew");

  useEffect(() => {
    if (isAuthenticated && !loading)
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
          {searchParams.get("createNew")
            ? "Hold up! Let's login first.."
            : "Welcome Back"}
        </h1>
        <p className="text-gray-400">
          {searchParams.get("createNew")
            ? "Sign in to create your short link"
            : "Sign in to manage your links"}
        </p>
      </div>
      <Tabs defaultValue="login" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-neutral-800">
          <TabsTrigger 
            value="login"
            className="data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="signup"
            className="data-[state=active]:bg-[#f97316] data-[state=active]:text-white"
          >
            Signup
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Auth;