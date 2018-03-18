import mongoose from 'mongoose';

const Project = mongoose.model('Project', {
  name: String,
  repo: String,
  url: String,
  latestVersion: String,
  versions: [String]
});

export const findProjectNames = () =>
  Project.find()
    .exec()
    .then(projects => projects.map(p => p.name));

export const findProjects = () => Project.find().exec();

export const updateProjectVersions = (project, versions) =>
  Project.findOneAndUpdate({ name: project }, { versions });
