import React, { useContext } from "react";
import { UserAuthContext } from "../AuthProvider";
import { Link } from "react-router-dom";

function Home() {
  const { user } = useContext(UserAuthContext);
  return (
    <main>
      <section className="about relative w-full h-screen overflow-hidden">
        <div className="image absolute inset-0">
          <img
            src="/studio.jpg"
            alt="studio"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="overlay absolute inset-0 bg-black/50 z-10"></div>

        <div className="content-over-overlay relative z-20 h-full flex flex-col justify-center items-center text-white px-8">
          <div className="content flex flex-col md:flex-row items-center gap-12 max-w-6xl">
            <p className="flex-1 text-lg text-text leading-relaxed font-light ">
              At Schätzen Studio, we believe the most fleeting moments are the
              ones worth holding onto forever. Schätzen means to treasure—and
              that is exactly what we do. We don't just take pictures; we curate
              memories.
            </p>

            <div className="flex-1 flex justify-center">
              <img
                src="/studiohalf.jpg"
                className="w-64 h-96 object-cover border border-white/20 shadow-2xl"
                alt="studio detail"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="description py-24 px-8 text-center bg-background border-y border-surface">
        <h2 className="text-text text-2xl md:text-4xl font-light max-w-4xl mx-auto leading-relaxed tracking-wide">
          Schatzen is a <span className="text-accent">full-service</span>{" "}
          photography studio blending creativity with craftsmanship.
        </h2>

        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-muted uppercase tracking-[0.2em] text-xs">
          <div className="flex flex-col items-center gap-2">
            <span className="text-accent text-3xl font-medium tracking-normal mb-1">
              250+
            </span>
            <span>Projects Completed</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-accent text-3xl font-medium tracking-normal mb-1">
              15+
            </span>
            <span>Years of Experience</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-accent text-3xl font-medium tracking-normal mb-1">
              98%+
            </span>
            <span>Client Satisfaction</span>
          </div>
        </div>
      </div>

      <section className="portfolio py-24 px-8 bg-background">
        {/* Header Section */}
        <div className="mb-24 text-center">
          <p className="text-accent uppercase tracking-[0.3em] text-xs mb-4">
            Our projects
          </p>
          <h2 className="text-text text-3xl md:text-5xl font-light max-w-2xl mx-auto leading-tight">
            Our portfolio showcases the{" "}
            <span className="italic">diversity</span> of our creativity
          </h2>
        </div>

        <div className="flex flex-col gap-32">
          <div className="flex justify-end pr-12 md:pr-48 items-end gap-8 group">
            <div className="info text-right pb-4">
              <p className="text-muted text-xs uppercase tracking-widest">
                Moments of joy
              </p>
              <h3 className="text-text font-light text-lg">2026-01-25</h3>
            </div>
            <div className="overflow-hidden w-2/5">
              <img
                src="./wedding.jpg"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="flex justify-end pr-8 md:pr-28 items-center gap-6 group">
            <div className="info text-right">
              <p className="text-muted text-xs uppercase tracking-widest">
                Yada yada
              </p>
              <h3 className="text-text font-light">2025-05-04</h3>
            </div>
            <div className="overflow-hidden w-64 h-96">
              <img
                src="./product.jpg"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
              />
            </div>
          </div>

          <div className="flex justify-start pl-8 md:pl-28 items-start gap-8 group">
            <div className="overflow-hidden w-2/6 h-[500px]">
              <img
                src="./model.jpg"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="info pt-12">
              <p className="text-muted text-xs uppercase tracking-widest">
                yada yda
              </p>
              <h3 className="text-text font-light text-lg">2024-12-17</h3>
            </div>
          </div>

          <div className="flex justify-start pl-12 md:pl-44 items-center gap-10 group">
            <div className="overflow-hidden w-1/3 aspect-[4/5]">
              <img
                src="./exhibition.jpg"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="info">
              <p className="text-muted text-xs uppercase tracking-widest">
                yada yda
              </p>
              <h3 className="text-text font-light text-lg">2024-12-17</h3>
            </div>
          </div>
        </div>
      </section>

      <div className="book-now py-32 px-8 bg-surface text-center border-t border-white/5">
        <p className="text-muted uppercase tracking-[0.4em] text-xs mb-8">
          Ready to capture your moment?
        </p>

        <Link to="/auth/login" className="inline-block group">
          <button className="relative px-12 py-4 text-text border border-accent overflow-hidden transition-all duration-500 hover:text-background">
           
            

            <span className="text-sm uppercase tracking-widest font-medium">
              Book a session
            </span>
          </button>
        </Link>
      </div>
    </main>
  );
}

export default Home;
