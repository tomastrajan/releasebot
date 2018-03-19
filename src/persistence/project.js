import mongoose from 'mongoose';

const Project = mongoose.model('Project', {
  name: String,
  repo: String,
  urlType: String,
  url: String,
  hashtags: [String],
  versions: [String]
});

export const findProjectNames = () =>
  Project.find()
    .exec()
    .then(projects => projects.map(p => p.name));

export const findProjects = () => Project.find().exec();

export const updateProjectVersions = (project, versions) =>
  Project.findOneAndUpdate({ name: project.name }, { versions });

export const insertProject = (name, repo, urlType, url, hashtags, versions) =>
  Project.create({
    name,
    repo,
    urlType,
    url,
    hashtags: hashtags.split(','),
    versions
  });
