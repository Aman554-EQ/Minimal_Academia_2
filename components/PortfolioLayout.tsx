"use client";

import { useState, useEffect, useCallback } from "react";
import Navigation from "./Navigation";
import LeftSidebar from "./LeftSidebar";
import Footer from "./Footer";
import HomePage from "./HomePage";
import PublicationsPage from "./PublicationsPage";
import NewsPage from "./NewsPage";
import CVPage from "./CVPage";

interface PersonalInfo {
  id?: number;
  name: string;
  title: string;
  email: string;
  githubUrl?: string | null;
  githubLabel?: string | null;
  scholarUrl?: string | null;
  linkedinUrl?: string | null;
  researchInterests?: string | null;
}

export default function PortfolioLayout() {
  const [currentPage, setCurrentPage] = useState("home");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);

  const fetchPersonalInfo = useCallback(async () => {
    const res = await fetch("/api/personal-info");
    const data = await res.json();
    setPersonalInfo(data);
  }, []);

  useEffect(() => {
    fetchPersonalInfo();
  }, [fetchPersonalInfo]);

  const renderPage = () => {
    switch (currentPage) {
      case "publications":
        return <PublicationsPage />;
      case "news":
        return <NewsPage />;
      case "cv":
        return <CVPage />;
      default:
        return (
          <HomePage
            onViewAllPublications={() => setCurrentPage("publications")}
            onViewAllNews={() => setCurrentPage("news")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        ownerName={personalInfo?.name || "Mohammed Aman Bhuiyan"}
      />

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-1 order-1">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-4">
                <LeftSidebar info={personalInfo} onUpdate={fetchPersonalInfo} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 order-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
              {renderPage()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
