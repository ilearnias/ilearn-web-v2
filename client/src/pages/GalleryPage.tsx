import { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import QUERY_KEY from '@/config/queryKeys';
import apiClient from '@/config/apiClient';
import { API } from '@/config/api';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// API types
type GalleryImage = {
  image: string;
  subtitle?: string;
  description?: string;
};

type GallerySection = {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type GalleryApiResponse = {
  status: boolean;
  message: string;
  data: GallerySection[];
  meta: {
    limit: number;
    itemCount: number;
    page: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
};

const GalleryPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useQuery<GalleryApiResponse>({
    queryKey: [QUERY_KEY.GALLERY, page],
    queryFn: async () => {
      const response = await apiClient.get(`${API.GALLERY}?isActive=true&page=${page}`);
      return response?.data;
    },
  });

  const gallerySections: GallerySection[] = data?.data || [];
  const meta = data?.meta;

  // Modal state for image preview
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<GalleryImage | null>(null);

  return (
    <>
      <Helmet>
        <title>Gallery | iLearn IAS Academy</title>
        <meta name="description" content="Browse our gallery showcasing infrastructure, success stories, and student life at iLearn IAS Academy." />
      </Helmet>
      
      <PageTransition>
        {/* Hero Section - Material Design 3 Style */}
        <section className="py-10 md:py-16 relative overflow-hidden">
          {/* Material Design 3 layered background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 z-0"></div>
          
          {/* Material Design 3 decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-blue opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-primary-blue opacity-5 blur-2xl"></div>
          
          {/* Decorative pattern - subtle dots */}
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle, #20468D 1px, transparent 1px)', 
                 backgroundSize: '30px 30px' 
               }}>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <span className="text-sm text-primary-blue-700 font-medium bg-primary-blue-50 px-4 py-1.5 rounded-full shadow-sm mb-4 border border-primary-blue-100">Our Media Collection</span>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-blue-800 mb-4 leading-tight">
                Explore our <span className="text-primary-red relative">Gallery
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-primary-red/30 rounded-full"></span>
                </span>
              </h1>
              <p className="text-neutral-700 max-w-2xl mx-auto text-lg leading-relaxed mb-5">
                Discover our campus infrastructure, success stories, and vibrant student life through our curated collection of images and videos.
              </p>
              
              <div className="flex gap-3 mt-2">
                <div className="w-3 h-3 rounded-full bg-primary-blue"></div>
                <div className="w-3 h-3 rounded-full bg-primary-red"></div>
                <div className="w-3 h-3 rounded-full bg-primary-blue-300"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Gallery Sections */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-16 h-16 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : isError ? (
              <div className="text-center text-red-500 py-8">Failed to load gallery.</div>
            ) : gallerySections.length === 0 ? (
              <div className="text-center text-neutral-500 py-8">No gallery sections found.</div>
            ) : (
              <div className="space-y-20 md:space-y-24">
                {gallerySections.map((section) => (
                  <div key={section?.id} className="category-section">
                    {/* Section Header with same style pattern */}
                    <div className="flex items-center mb-10 md:mb-12">
                      <div className="flex items-center">
                        <div className="w-2 h-16 bg-gradient-to-b from-primary-blue to-primary-blue-700 rounded-full mr-5"></div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-primary-blue-800">{section?.title ?? ''}</h2>
                        </div>
                      </div>
                    </div>
                    
                    {/* Image carousel - Original style with enhanced overlays */}
                    <div className="relative p-4 bg-white rounded-xl border border-neutral-100 shadow-sm mb-8">
                      <div className="relative overflow-x-auto pb-6">
                        <div className="flex space-x-4 w-full" style={{ scrollBehavior: 'smooth' }}>
                          {section?.images?.map((img, idx) => (
                            <div
                              key={(img?.image ?? '') + idx}
                              className="relative flex-shrink-0 w-[280px] md:w-[48%] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                              onClick={() => {
                                setModalImage(img);
                                setIsModalOpen(true);
                              }}
                            >
                              <div className="aspect-[4/3]">
                                <img
                                  src={img?.image ?? ''}
                                  alt={img?.subtitle ?? section?.title ?? ''}
                                  className="w-full h-full object-cover"
                                />
                                
                                {/* Hover overlay with subtitle and description */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    {img?.subtitle && (
                                      <h3 className="text-lg font-bold mb-1 leading-tight">
                                        {img.subtitle}
                                      </h3>
                                    )}
                                    {img?.description && (
                                      <p className="text-sm opacity-90 leading-relaxed">
                                        {img.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Hover effect overlay */}
                                <div className="absolute inset-0 bg-primary-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Section Description at bottom */}
                    <div className="text-center">
                      <p className="text-lg text-neutral-600 max-w-4xl mx-auto leading-relaxed">
                        {section?.description ?? ''}
                      </p>
                    </div>
                  </div>
                ))}
                
                {meta && meta.totalPages > 1 && (
                  <Pagination className="mt-16">
                    <PaginationContent>
                      {meta.hasPreviousPage && (
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={e => {
                              e.preventDefault();
                              setPage(p => Math.max(1, p - 1));
                              window.scrollTo(0, 0);
                            }}
                          />
                        </PaginationItem>
                      )}
                      {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          return (
                            page === 1 ||
                            page === meta.totalPages ||
                            Math.abs(page - meta.page) <= 1
                          );
                        })
                        .map((page, index, array) => {
                          const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                          return (
                            <div key={page} className="flex items-center">
                              {showEllipsisBefore && (
                                <PaginationItem>
                                  <span className="px-4 py-2">...</span>
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  href="#"
                                  onClick={e => {
                                    e.preventDefault();
                                    setPage(page);
                                    window.scrollTo(0, 0);
                                  }}
                                  isActive={page === meta.page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </div>
                          );
                        })}
                      {meta.hasNextPage && (
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={e => {
                              e.preventDefault();
                              setPage(p => Math.min(meta.totalPages, p + 1));
                              window.scrollTo(0, 0);
                            }}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
          </div>
        </section>
      </PageTransition>

      {/* Media Modal - Material Design 3 Style */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] h-[85vh] md:max-h-[90vh] md:max-w-6xl p-0 bg-black w-[95vw] md:w-auto overflow-hidden rounded-xl border-0 flex flex-col" aria-describedby="gallery-modal-description">
          <DialogTitle className="sr-only">Media Preview</DialogTitle>
          <div id="gallery-modal-description" className="sr-only">Gallery media preview</div>
          {modalImage && (
            <div className="flex flex-col items-center justify-center w-full h-full p-6">
              <img
                src={modalImage?.image ?? ''}
                alt={modalImage?.subtitle ?? ''}
                className="object-contain max-h-[70vh] max-w-full rounded-xl shadow-lg"
              />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-medium text-white mb-2">{modalImage?.subtitle ?? ''}</h3>
                <p className="text-white/80">{modalImage?.description ?? ''}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryPage;