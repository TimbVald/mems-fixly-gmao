'use client';
 
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Wrench, Users, Building, Package, FileText } from 'lucide-react';
 
const features = [
  {
    step: 'Module 1',
    title: 'Gestion des Équipements',
    content:
      'Centralisez et gérez tous vos équipements avec un suivi complet de leur état, maintenance et historique.',
    icon: <Wrench className="h-6 w-6 text-primary" />,
    image:
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&auto=format&fit=crop',
  },
  {
    step: 'Module 2',
    title: 'Gestion des Interventions',
    content:
      'Planifiez et suivez vos interventions : demandes, ordres de travail et comptes rendus en temps réel.',
    icon: <FileText className="h-6 w-6 text-primary" />,
    image:
      'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop',
  },
  {
    step: 'Module 3',
    title: 'Gestion des Stocks',
    content:
      'Optimisez votre inventaire avec un suivi précis des pièces détachées, consommables et alertes de réapprovisionnement.',
    icon: <Package className="h-6 w-6 text-primary" />,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
  },
  {
    step: 'Module 4',
    title: 'Gestion du Personnel',
    content:
      'Organisez vos équipes de maintenance avec planning, compétences et affectation optimisée des ressources.',
    icon: <Users className="h-6 w-6 text-primary" />,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
  },
];
 
export default function FeatureSteps() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
 
  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (4000 / 100));
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 100);
 
    return () => clearInterval(timer);
  }, [progress]);
 
  return (
    <div className={'p-8 md:p-12'}>
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative mx-auto mb-12 max-w-2xl sm:text-center">
          <div className="relative z-10">
            <h2 className="font-geist text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
              Une Solution Complète en Quatre Modules
            </h2>
            <p className="font-geist mt-3 text-foreground/60">
              Machine Care vous offre tous les outils nécessaires pour une gestion de maintenance 
              efficace et optimisée, de la planification à l'exécution.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background:
                'linear-gradient(152.92deg, rgba(192, 15, 102, 0.2) 4.54%, rgba(192, 11, 109, 0.26) 34.2%, rgba(192, 15, 102, 0.1) 77.55%)',
            }}
          ></div>
        </div>
        <hr className="mx-auto mb-10 h-px w-1/2 bg-foreground/30" />
 
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-10">
          <div className="order-2 space-y-8 md:order-1">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-6 md:gap-8"
                initial={{ opacity: 0.3, x: -20 }}
                animate={{
                  opacity: index === currentFeature ? 1 : 0.3,
                  x: 0,
                  scale: index === currentFeature ? 1.05 : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 md:h-14 md:w-14',
                    index === currentFeature
                      ? 'scale-110 border-primary bg-primary/10 text-primary [box-shadow:0_0_15px_rgba(192,15,102,0.3)]'
                      : 'border-muted-foreground bg-muted',
                  )}
                >
                  {feature.icon}
                </motion.div>
 
                <div className="flex-1">
                  <h3 className="text-xl font-semibold md:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
 
          <div
            className={cn(
              'relative order-1 h-[200px] overflow-hidden rounded-xl border border-primary/20 [box-shadow:0_5px_30px_-15px_rgba(192,15,102,0.3)] md:order-2 md:h-[300px] lg:h-[400px]',
            )}
          >
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 overflow-hidden rounded-lg"
                      initial={{ y: 100, opacity: 0, rotateX: -20 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -100, opacity: 0, rotateX: 20 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="h-full w-full transform object-cover transition-transform hover:scale-105"
                        width={1000}
                        height={500}
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background via-background/50 to-transparent" />
 
                      <div className="absolute bottom-4 left-4 rounded-lg bg-background/80 p-2 backdrop-blur-sm">
                        <span className="text-xs font-medium text-primary">
                          {feature.step}
                        </span>
                      </div>
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
 