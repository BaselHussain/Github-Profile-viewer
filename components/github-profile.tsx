"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  ExternalLinkIcon,
  ForkliftIcon,
  LocateIcon,
  RecycleIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import  Spinner  from "@/components/ui/spinner";
import { profile } from "node:console";


type UserProfile={
    login:string;
    avatar_url:string;
    html_url:string;
    bio:string;
    followers:number;
    following:number;
    location:string
}

type UserRepo={
    id:number;
    name:string;
    html_url:string;
    description:string;
    stargazers_count:number;
    forks_count:number
}



export default function GitHubProfileViewer() {
    const [username,setUsername]=useState<string>("")
    const [userProfile,setUserProfile]=useState<UserProfile | null>(null)
    const [userRepos,setUserRepos]=useState<UserRepo[]>([])
    const [loading,setLoading]=useState<boolean>(false)
    const [error,setError]=useState<string | null>(null)

    const fetchUserData=async():Promise<void>=>{
setLoading(true)
setError(null)
try {
    const profileResponse=await fetch(`https://api.github.com/users/${username}`)

if(!profileResponse.ok){
    throw new Error("User not found")
}
const profileData=await profileResponse.json()

const reposResponse=await fetch(`https://api.github.com/users/${username}/repos`)

if(!reposResponse.ok){
    throw new Error("Repositories not found");
}
const reposData=await reposResponse.json()
setUserProfile(profileData)
setUserRepos(reposData)



} catch (error:any) {
    setError(error.message)
}finally{
    setLoading(false)
}

    }

const handleSubmit=(e:React.FormEvent<HTMLFormElement>):void=>{
e.preventDefault()
fetchUserData()
}

return(
    <>
    <div className="h-screen flex flex-col bg-gradient-to-tr items-center justify-center from-[#ee47b6] to-[#17b970]"> 
<Card className="w-full max-w-3xl p-6 space-y-4 overflow-y-scroll">
<CardHeader>
    <CardTitle className="text-2xl font-bold text-center">Github Profile Viewer</CardTitle>
    <CardDescription className="text-gray-600 text-center">
            Search for a GitHub username and view their profile and
            repositories, search like: BaselHussain
          </CardDescription>
</CardHeader>

<form onSubmit={handleSubmit}>
    <div className="grid grid-cols-[3fr_1fr] gap-4">
<Input
type="text"
placeholder="Enter github username here"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>
<Button
type="submit"
disabled={loading}>{
loading?<Spinner/>:"Search"}
</Button>
</div>
</form>
{error && (
    <div className="text-red-600 text-center">{error}</div>
)}

{userProfile && (
   <div className="grid gap-8 px-6">
          <div className="grid md:grid-cols-[120px_1fr] gap-6">
            <Avatar className="w-30 h-30 border">
              <AvatarImage src={userProfile.avatar_url} />
              <AvatarFallback>
                {userProfile.login.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{userProfile.login}</h2>
                <Link
                  href={userProfile.html_url}
                  target="_blank"
                  className="text-black"
                  prefetch={false}
                >
                  <ExternalLinkIcon className="w-5 h-5" />
                </Link>
              </div>
              <div className="">
                <p className="text-gray-700">{userProfile.bio}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex gap-2">
                <UsersIcon/>
                <span>Followers</span>
                </div>
                <div className="flex gap-2">
                <UsersIcon/>
                <span>Following</span>
                </div>
                <div className="flex gap-2">
                <LocateIcon/>
                <span>{userProfile.location || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>


<div className="grid gap-6">
<h3 className="text-xl font-bold">Repositiries</h3>
<div className="grid grid-cols-2 gap-5">
{userRepos.map((repo)=>(
    <Card
    key={repo.id}
    className="shadow-md rounded-lg bg-white border">
<CardHeader>
    <div className="flex items-center gap-3">
        <RecycleIcon/>
        <Link
        href={repo.html_url}
        target="_blank"
        prefetch={false}>
<CardTitle>
    {repo.name}
    </CardTitle>
    </Link>
    </div>
</CardHeader>
<CardContent>
    <p className="text-gray-600">{repo.description || "No Description"}</p>
</CardContent>
<CardFooter className="flex justify-between items-center">
    <div className="flex items-center space-x-2">
<StarIcon/><span>{repo.stargazers_count}</span>
<ForkliftIcon/><span>{repo.forks_count}</span>
    </div>


    <div>
    <Link
        href={repo.html_url}
        target="_blank"
        prefetch={false}
        className="hover:underline">
        View On Github
        </Link>
        </div>
</CardFooter>
    </Card>
))}
</div>
</div>

          </div>





)}






</Card>





    </div>
    </>
)




}