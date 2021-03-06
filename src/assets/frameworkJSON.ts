export let framework = {
  'Version': '1.0.0',
  'StatusCode': 200,
  'Success': true,
  'Authorized': true,
  'Result': {
    'theme': 'themeCIS',
    'prefLang': 'en',
    'langList': [
      'en',
      'es',
      'ht'
    ],
    'header': {
      'logo': 'cisLogo',
      'longName': 'Career Information System',
      'shortName': 'CIS'
    },
    'footer': {
      'copyright': `Copyright © 1971-2017 University of Oregon. 
                    All rights reserved. Created by intoCareers, a unit of the University of Oregon.`
    },
    'modules': {
      'defaultModule': 'modDashboard',
      'modList': [
        {
          'module_id': 'modDashboard',
          'layout': 'dashboard',
          'defaultComp': '',
          'displayName': 'My Dashboard',
          'compList': [
            {
              'compId': 'dashSorts',
              'icon': '',
              'displayName': 'Assessements'
            },
            {
              'compId': 'dashOccs',
              'icon': '',
              'displayName': 'Saved Occupations'
            },
            {
              'compId': 'dashSchools',
              'icon': '',
              'displayName': 'Favorite Schools'
            },
            {
              'compId': 'dashPLP',
              'icon': '',
              'displayName': 'PLP Completion'
            }
          ]
        },
        {
          'module_id': 'modSorts',
          'layout': 'widget',
          'defaultComp': '',
          'displayName': 'Assessments',
          'compList': [
            {
              'compId': 'sortShortIP',
              'icon': '',
              'url': './interestProfilerSf/intro',
              'displayName': 'Interest Profiler'
            },
            {
              'compId': 'plpPersonalInfo',
              'icon': '',
              'url': './personalInfo',
              'displayName': 'My Personal Information'
            },
            {
              'compId': 'plpEducationPlans',
              'icon': '',
              'url': './educationPlans',
              'displayName': 'My Education Plans'
            },
            {
              'compId': 'sortCCIJr',
              'icon': '',
              'displayName': 'Career Cluster Inventory'
            },
            {
              'compId': 'sortLearnStyle',
              'icon': '',
              'displayName': 'Learning Styles Survey'
            },
            {
              'compId': 'sortOccSort',
              'icon': '',
              'url': './occSort/intro',
              'displayName': 'Occupation Sort'
            },
            {
              'compId': 'sortRealityCheck',
              'icon': '',
              'displayName': 'Reality Check'
            },
            {
              'compId': 'sortWES',
              'icon': '',
              'displayName': 'Workplace Employability Skills'
            },
            {
              'compId': 'sortEntQuiz',
              'icon': '',
              'url': './entrepreneurQuiz/intro',
              'displayName': 'Entrepreneurial Assessment'
            },

            {
              'compId': 'sortIDEAS',
              'icon': '',
              'displayName': 'IDEAS'
            },
            {
              'compId': 'sortWIL',
              'icon': '',
              'displayName': 'Work Importance Locator'
            }
          ]
        },
        {
          'module_id': 'modPLP',
          'layout': 'widget',
          'defaultComp': 'plpPersonalInfo',
          'displayName': 'Personal Learning Plan',
          'compList': [
            {
              'compId': 'plpPersonalInfo',
              'icon': '',
              'displayName': 'My Personal Information'
            },
            {
              'compId': 'plpCareerGoals',
              'icon': '',
              'displayName': 'My Career Goals'
            },
            {
              'compId': 'plpEducationPlans',
              'icon': '',
              'displayName': 'My Education Plans'
            },
            {
              'compId': 'plpSortsAssessments',
              'icon': '',
              'displayName': 'Self-knowledge and Career Assessments (Most recent results)'
            },
            {
              'compId': 'plpCareerClusters',
              'icon': '',
              'displayName': 'Career Clusters of Interest'
            },
            {
              'compId': 'plpOccsAndClusters',
              'icon': '',
              'displayName': 'Occupations and Clusters of Interest (Most recently saved)'
            },
            {
              'compId': 'plpCoursePlan',
              'icon': '',
              'displayName': 'Pathway and Course Plan'
            },
            {
              'compId': 'plpGradRequirements',
              'icon': '',
              'displayName': 'Recommended courses for college-bound students'
            },
            {
              'compId': 'plpTestScores',
              'icon': '',
              'displayName': 'Test Scores'
            },
            {
              'compId': 'plpProgramsOfStudy',
              'icon': '',
              'displayName': 'Programs of Study of Interest (Most recently saved)'
            },
            {
              'compId': 'plpPostsecondarySchools',
              'icon': '',
              'displayName': 'Postsecondary Schools of Interest (Most recently saved)'
            },
            {
              'compId': 'plpCommunityService',
              'icon': '',
              'displayName': 'Volunteer and Community Service (Most recent)'
            },
            {
              'compId': 'plpExtracurricularActivities',
              'icon': '',
              'displayName': 'Extracurricular Activities (Most recent)'
            },
            {
              'compId': 'plpEmploymentHistory',
              'icon': '',
              'displayName': 'Employment History and Work-based Learning Experience (Most recent)'
            },
            {
              'compId': 'plpActionPlan',
              'icon': '',
              'displayName': 'My Action Plan for this Year'
            },
            {
              'compId': 'plpSupportNetwork',
              'icon': '',
              'displayName': 'My Support Network'
            },
            {
              'compId': 'plpExperientialLearning',
              'icon': '',
              'displayName': 'My Experiential Learning'
            },
            {
              'compId': 'plpCommentsSign',
              'icon': '',
              'displayName': 'Comments and Signatures'
            }
          ]
        },

        {
          'module_id': 'modOccs',
          'layout': 'tiles',
          'defaultComp': '',
          'displayName': 'Occupations',
          'compList': [
            {
              'compId': 'fileOcc',
              'icon': '',
              'displayName': 'Occupations'
            },
            {
              'compId': 'fileMil',
              'icon': '',
              'displayName': 'Military Occupations'
            }
          ]
        },
        {
          'module_id': 'modEducation',
          'layout': 'tiles',
          'defaultComp': '',
          'displayName': 'Education',
          'compList': [
            {
              'compId': 'fileNSch',
              'icon': '',
              'displayName': 'Colleges and Universities'
            },
            {
              'compId': 'fileProg',
              'icon': '',
              'displayName': 'Programs of Study'
            }
          ]
        },
        {
          'module_id': 'modJobSearch',
          'layout': 'tiles',
          'defaultComp': '',
          'displayName': 'Job Search',
          'compList': [
            {
              'compId': 'resumeWriter',
              'icon': '',
              'displayName': 'Resume Writer'
            }
          ]
        }
      ]
    }
  }
};
