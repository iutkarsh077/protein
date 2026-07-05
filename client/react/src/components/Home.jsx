import { useCallback, useEffect, useMemo, useState } from "react";
import { isSameDay } from "date-fns";
import { toast } from "react-toastify";

import DailyInsightCard from "@/components/home/DailyInsightCard";
import CaloriesCard from "@/components/home/CaloriesCard";
import DashboardHeader from "@/components/home/DashboardHeader";
import DateStrip from "@/components/home/DateStrip";
import MacroNutrientsCard from "@/components/home/MacroNutrientsCard";
import Sidebar from "@/components/home/Sidebar";
import TodaysMealsCard from "@/components/home/TodaysMealsCard";
import WeeklyIntakeCard from "@/components/home/WeeklyIntakeCard";
import { useGlobalContext } from "@/contexts/GlobalContext";
import {
  buildNutritionDashboard,
  EMPTY_NUTRITION_DASHBOARD,
  getAvailableDates,
} from "@/lib/nutritionDashboard";
import api from "@/utils/api";

const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
];

export default function Home() {
  const { user } = useGlobalContext();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [analysisData, setAnalysisData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const { data } = await api.get("/api/get-user-data");
      setAnalysisData(data.userAnalysisData ?? []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ?? "Failed to load nutrition data",
      );
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetchUserData();
  }, [user?.id, fetchUserData]);

  const availableDates = useMemo(
    () => getAvailableDates(analysisData),
    [analysisData],
  );

  useEffect(() => {
    if (availableDates.length === 0) return;

    setSelectedDate((current) => {
      const currentHasData = availableDates.some((date) =>
        isSameDay(date, current),
      );
      return currentHasData ? current : availableDates[0];
    });
  }, [availableDates]);

  const dashboard = useMemo(
    () =>
      isLoadingData
        ? EMPTY_NUTRITION_DASHBOARD
        : buildNutritionDashboard(analysisData, selectedDate),
    [analysisData, selectedDate, isLoadingData],
  );

  const uploadMealImage = useCallback(
    async (userImage) => {
      if (!ACCEPTED_IMAGE_TYPES.includes(userImage.type)) {
        toast.error(`We do not accept ${userImage.type} format`);
        return false;
      }

      try {
        const { data } = await api.post("/api/get-url", {
          fileName: userImage.name.trim(),
          fileType: userImage.type.trim(),
        });

        if (!user?.id) {
          toast.error("User not found");
          return false;
        }

        await fetch(data.uploadUrl, {
          method: "PUT",
          body: userImage,
          headers: { "Content-Type": userImage.type },
        });

        await api.post("/api/analyze-image", {
          key: data.key,
          id: user.id,
        });

        toast.success("Image uploaded and sent for analysis");
        await fetchUserData();
        return true;
      } catch {
        toast.error("Failed to upload image");
        return false;
      }
    },
    [fetchUserData, user?.id],
  );

  const handleFileUpload = async (event) => {
    const userImage = event.target.files?.[0];
    if (!userImage) return;

    await uploadMealImage(userImage);
    event.target.value = "";
  };

  return (
    <div className="min-h-screen bg-[#f6f7f2] font-sans text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-375">
        <Sidebar />

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:px-10 lg:py-8">
          <DashboardHeader
            userName={user?.name}
            onFileChange={handleFileUpload}
            onImageCapture={uploadMealImage}
          />

          <DateStrip
            dates={availableDates}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
            <CaloriesCard
              consumed={dashboard.consumed}
              goal={dashboard.goal}
            />
            <DailyInsightCard
              sugar={dashboard.sugar}
              sugarGoal={dashboard.sugarGoal}
              avgConfidence={dashboard.avgConfidence}
            />
          </div>

          <MacroNutrientsCard nutrients={dashboard.nutrients} />

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
            <TodaysMealsCard meals={dashboard.meals} />
            <WeeklyIntakeCard
              week={dashboard.week}
              weeklyAverage={dashboard.weeklyAverage}
              calorieGoal={dashboard.goal}
              activeDay={dashboard.activeDay}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
