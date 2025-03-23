import { CircleUserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "@/contexts2/AppContext";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UsernameMenu = () => {
  const { user, setUser, showToast } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isLoggedIn = !!user;

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      setUser(null);
      await queryClient.invalidateQueries("validateToken");
      await queryClient.removeQueries();
      showToast({ message: "Signed Out!", type: "SUCCESS" });
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleSignOut = () => {
    mutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 font-bold text-white">
        <CircleUserRound className="text-white" />
        {user ? (
          <span className="ml-2">{user?.email + "  -  Admin"}</span>
          
        ) : (
          <span className="ml-2">Guest</span>
        )}

        
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white content-center">
        {isLoggedIn && (
          <div className="px-4 py-2">
            <span className="flex flex-col space-y-2">
              <Link
                className="flex items-center text-blue-600 px-3 font-bold hover:bg-blue-100"
                to="/AddingHome"
              >
                {t("Adding Home Page")}
              </Link>
              <Link
                className="flex items-center text-blue-600 px-3 font-bold hover:bg-blue-100"
                to="/AddingVideos"
              >
                {t("Adding Videos")}
              </Link>
              <Link
                className="flex items-center text-blue-600 px-3 font-bold hover:bg-blue-100"
                to="/AddingPhotos"
              >
                {t("Adding Photos")}
              </Link>
              <Link
                className="flex items-center text-blue-600 px-3 font-bold hover:bg-blue-100"
                to="/AddingPartner"
              >
                {t("Adding Partner")}
              </Link>
              <Link
                className="flex items-center text-blue-600 px-3 font-bold hover:bg-blue-100"
                to="/MyNews"
              >
                {t("Adding News")}
              </Link>
            </span>
          </div>
        )}
        <DropdownMenuItem>
          <Button
            onClick={handleSignOut}
            className="flex flex-1 font-semibold hover:bg-[#fc9948] rounded-xl"
            variant="ghost"
          >
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsernameMenu;













/*import { CircleUserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "@/contexts2/AppContext";
import { useNavigate } from "react-router-dom"; // Added navigation

const UsernameMenu = () => {
  const { user, setUser, showToast } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Added navigation hook

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      // Force immediate state cleanup
      setUser(null);
      
      // Invalidate any cached queries related to auth
      await queryClient.invalidateQueries("validateToken");
      
      // Clear all query data for a fresh state
      await queryClient.removeQueries();
      
      // Show success feedback
      showToast({ message: "Signed Out!", type: "SUCCESS" });
      
      // Redirect to home page
      navigate("/"); // Added navigation
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleSignOut = () => {
    mutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 font-bold text-white">
        <CircleUserRound className="text-white" />
        {user ? (
          <span className="ml-2">{user?.email || "Admin"}</span>
        ) : (
          <span className="ml-2">Gest</span> // Better fallback
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white content-center">
        <DropdownMenuItem>

          
          <Button
            onClick={handleSignOut}

            className="flex flex-1 font-semibold hover:bg-[#fc9948] rounded-1xl"
            variant="ghost" // Better button semantics
          >
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsernameMenu;

*/






/* before dp import { CircleUserRound } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenuContent } from "./ui/dropdown-menu";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "@/contexts2/AppContext";
//import { Link } from "react-router-dom";

const UsernameMenu = () => {
  const { user, setUser, showToast } = useAppContext();
  const queryClient = useQueryClient();

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      setUser(null); // Clear user data on logout
      showToast({ message: "Signed Out!", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleSignOut = () => {
    mutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 font-bold text-white">
        <CircleUserRound className="text-white" />
        <span className="ml-2">{user?.email || "Admin"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white content-center">
       
     
        <DropdownMenuItem>
          <Button
            onClick={handleSignOut}
            className="flex flex-1 font-semibold hover:bg-[#fc9948] rounded-1xl"
          >
           sign out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsernameMenu;*/




/*

 <DropdownMenuItem>
          <Link
            to="/user-profile"
            className="flex flex-1 font-semibold hover:bg-[#fc9948] rounded-1xl"
          >
            User Profile
          </Link>
        </DropdownMenuItem> 
        */