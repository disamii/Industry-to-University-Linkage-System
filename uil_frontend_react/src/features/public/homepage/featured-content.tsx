import { Pagination } from "@/components/reusable/pagination";
import { QueryState } from "@/components/reusable/query-state-ui";
import { Button } from "@/components/ui/button";
import { useGetPostsList } from "@/data/posts/posts-list-query";
import { usePostParams } from "@/data/posts/use-post-params";
import { PostType } from "@/lib/enums";
import { formatType } from "@/lib/utils";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const PostTypes = ["All", ...Object.values(PostType)];

type Props = {
  maxVisible?: "all" | number;
  variant?: "related" | "default";
};

export default function FeaturedContent({
  maxVisible = 4,
  variant = "default",
}: Props) {
  const navigate = useNavigate();

  const { params, setParams } = usePostParams();
  const activeTab = params.post_type || "All";

  useEffect(() => {
    if (!params.post_type) {
      setParams({ post_type: "All" });
    }
  }, [params.post_type, setParams]);

  const query = useGetPostsList();

  return (
    <section className="w-full">
      {/* Section Header */}
      {variant === "default" ? (
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-foreground text-4xl md:text-5xl tracking-tight">
            Featured <span className="text-primary">Innovation</span>
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground text-lg leading-relaxed">
            Explore the latest milestones and active research emerging from our
            collaborative academic and industrial network.
          </p>
        </div>
      ) : (
        <h1 className="mt-16 mb-12 font-bold text-foreground text-4xl text-center tracking-tight">
          Related <span className="text-primary">Posts</span>
        </h1>
      )}

      {/* Filter Bar */}
      {variant === "default" && (
        <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
          {PostTypes.map((type, idx) => {
            const isActive = activeTab === type;
            return (
              <button
                key={`${type}-${idx}`}
                onClick={() => setParams({ post_type: type })}
                className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide border transition-all duration-200
                ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {formatType(type)}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      <QueryState
        query={query}
        checkEmpty={(data) => !data || data.results.length === 0}
        variant="section"
      >
        {({ results, pagination }) => {
          // Slice the array based on maxVisible prop
          const visibleResults =
            maxVisible === "all" ? results : results.slice(0, maxVisible);

          return (
            <div>
              <div
                className={`gap-8 grid grid-cols-1 transition-all duration-500 ${
                  visibleResults.length === 1
                    ? "lg:grid-cols-1 lg:max-w-sm"
                    : visibleResults.length === 2
                      ? "lg:grid-cols-2"
                      : "lg:grid-cols-3"
                }`}
              >
                {visibleResults.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex flex-col bg-card/50 shadow-sm backdrop-blur-sm border border-border hover:border-border/80 rounded-3xl h-full overflow-hidden transition-all hover:-translate-y-2 duration-500"
                  >
                    {/* Cover Image */}
                    {item.image ? (
                      <div className="relative w-full h-48 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center gap-2 bg-muted/40 w-full h-48 text-muted-foreground">
                        <ImageOff size={28} className="opacity-40" />
                        <span className="opacity-50 text-xs">No cover</span>
                      </div>
                    )}

                    <div className="flex flex-col flex-1 p-8">
                      {/* Post Type Badge */}
                      <div className="mb-6">
                        <span className="inline-flex justify-center items-center bg-primary/10 px-3 py-1 rounded-xl font-bold text-[10px] text-primary uppercase tracking-[0.2em]">
                          {formatType(item.post_type)}
                        </span>
                      </div>

                      <div className="grow">
                        <h3 className="mb-4 font-bold text-foreground text-2xl leading-tight">
                          {item.title}
                        </h3>
                        <p className="mb-8 text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                          {item.content}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-6 border-border border-t">
                        <div className="flex flex-col gap-1">
                          {item.published_at && (
                            <>
                              <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                                Published
                              </span>
                              <span className="font-semibold text-foreground text-sm">
                                {new Date(
                                  item.published_at,
                                ).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          className="flex justify-center items-center hover:bg-primary border border-border hover:border-primary rounded-full w-10 h-10 hover:text-white transition-all duration-300"
                          onClick={() => navigate(`/posts/${item.id}`)}
                        >
                          <ArrowUpRight size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              {maxVisible === "all" ? (
                <Pagination totalItems={pagination.total} namespace="posts" />
              ) : (
                <div className="mt-16 text-center">
                  <Button
                    variant="ghost"
                    className="group inline-flex items-center gap-2 font-bold text-foreground hover:text-primary text-sm uppercase tracking-[0.15em] transition-colors"
                    asChild
                  >
                    <Link to="/posts">
                      View all projects
                      <div className="bg-primary w-8 group-hover:w-12 h-0.5 transition-all duration-300" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          );
        }}
      </QueryState>
    </section>
  );
}
