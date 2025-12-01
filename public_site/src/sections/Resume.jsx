import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award as AwardIcon } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { useScrollAnimation } from '../hooks/useAnimation';
import SkillBar from '../components/SkillBar';
import TimelineCard from '../components/TimelineCard';
import { fadeInUp, staggerContainer } from '../utils/animations';

const Resume = () => {
  const { data: skills } = useApi('/skills');
  const { data: experience } = useApi('/experience');
  const { data: education } = useApi('/education');
  const { data: certificates } = useApi('/certificates');
  const { ref, inView } = useScrollAnimation();
  const [activeTab, setActiveTab] = useState('experience');

  // Group skills by category (safe fallback)
  const groupedSkills =
    (Array.isArray(skills) &&
      skills.reduce((acc, skill) => {
        const cat = skill.category || 'General';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
      }, {})) ||
    {};

  const tabs = [
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'certificates', label: 'Certificates', icon: AwardIcon },
  ];

  return (
    <section id="resume" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              Resume & <span className="gradient-text">Skills</span>
            </h2>
            <div className="mx-auto w-28 h-1 rounded-full bg-gradient-to-r from-primary-500 to-purple-600" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Skills */}
            <motion.aside variants={fadeInUp} className="lg:col-span-1">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Technical Skills
              </h3>

              <div className="space-y-6">
                {Object.keys(groupedSkills).length === 0 && (
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-6 text-center text-gray-500">
                    No skill data yet.
                  </div>
                )}

                {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
                  <div
                    key={category}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
                  >
                    <h4 className="text-lg font-semibold text-primary-600 dark:text-primary-300 mb-4">
                      {category}
                    </h4>

                    <div className="space-y-4">
                      {categorySkills.map((skill, index) => (
                        <SkillBar
                          key={skill.id ?? `${category}-${index}`}
                          skill={skill}
                          delay={catIndex * 200 + index * 100}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>

            {/* Timeline & Tabs */}
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-3 mb-8">
                {tabs.map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      aria-pressed={active}
                      className={`flex-1 flex items-center gap-3 px-5 py-3 rounded-lg font-semibold transition-all duration-250 ${
                        active
                          ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:shadow-sm'
                      }`}
                    >
                      <tab.icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="relative">
                {/* EXPERIENCE */}
                {activeTab === 'experience' && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="space-y-8"
                  >
                    {!Array.isArray(experience) || experience.length === 0 ? (
                      <div className="rounded-xl bg-white dark:bg-gray-800 p-6 text-center text-gray-500">
                        No experience data found.
                      </div>
                    ) : (
                      experience.map((item, index) => (
                        <TimelineCard key={item.id ?? index} item={item} icon={Briefcase} index={index} />
                      ))
                    )}
                  </motion.div>
                )}

                {/* EDUCATION */}
                {activeTab === 'education' && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="space-y-8"
                  >
                    {!Array.isArray(education) || education.length === 0 ? (
                      <div className="rounded-xl bg-white dark:bg-gray-800 p-6 text-center text-gray-500">
                        No education records found.
                      </div>
                    ) : (
                      education.map((item, index) => (
                        <TimelineCard key={item.id ?? index} item={item} icon={GraduationCap} index={index} />
                      ))
                    )}
                  </motion.div>
                )}

                {/* CERTIFICATES */}
                {activeTab === 'certificates' && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {!Array.isArray(certificates) || certificates.length === 0 ? (
                      <div className="rounded-xl bg-white dark:bg-gray-800 p-6 text-center text-gray-500 col-span-full">
                        No certificates available.
                      </div>
                    ) : (
                      certificates.map((cert) => (
                        <article
                          key={cert.id}
                          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
                        >
                          {cert.image_url ? (
                            <img src={cert.image_url} alt={cert.name} className="w-full h-48 object-cover" />
                          ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center">
                              <AwardIcon size={64} className="text-white opacity-60" />
                            </div>
                          )}

                          <div className="p-6">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{cert.name}</h4>
                            <p className="text-primary-600 dark:text-primary-300 font-semibold mb-2">{cert.issuer}</p>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              Issued:{' '}
                              {cert.issue_date
                                ? new Date(cert.issue_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                  })
                                : '—'}
                            </p>

                            {cert.credential_url ? (
                              <a
                                href={cert.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center text-sm text-primary-600 dark:text-primary-300 hover:underline"
                              >
                                View Credential →
                              </a>
                            ) : (
                              <span className="text-sm text-gray-500">Credential not available</span>
                            )}
                          </div>
                        </article>
                      ))
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
