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

export const findProject = name => Project.findOne({ name }).exec();

export const updateProjectVersions = (name, versions) =>
  Project.findOneAndUpdate({ name }, { versions });

export const insertProject = (name, repo, urlType, url, hashtags, versions) =>
  Project.create({
    name,
    repo,
    urlType,
    url,
    hashtags: hashtags.split(','),
    versions
  });

export const removeProject = name => Project.remove({ name });
