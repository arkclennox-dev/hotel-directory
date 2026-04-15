import citiesData from "../../../database/cities.json";
import categoriesData from "../../../database/categories.json";
import facilitiesData from "../../../database/facilities.json";
import landmarksData from "../../../database/landmarks.json";
import hotelsData from "../../../database/hotels.json";
import blogPostsData from "../../../database/blog-posts.json";

import { City, Category, Facility, Landmark, Hotel, BlogPost } from "@/lib/types";

export const cities = citiesData as City[];
export const categories = categoriesData as Category[];
export const facilities = facilitiesData as Facility[];
export const landmarks = landmarksData as Landmark[];
export const hotels = hotelsData as Hotel[];
export const blogPosts = blogPostsData as BlogPost[];
