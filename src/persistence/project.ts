import * as mongoose from 'mongoose';

const Project = mongoose.model('Project', {
  name: String,
  repo: String,
  type: String,
  hashtags: [String],
  versions: [String]
});

export const findProjects = () => Project.find().exec();

export const findProject = repo => Project.findOne({ repo }).exec();

export const updateProjectVersions = (repo, versions) =>
  Project.findOneAndUpdate({ repo }, { versions });

export const insertProject = (name, repo, type, hashtags, versions) =>
  Project.create({
    name,
    repo,
    type,
    hashtags: hashtags.split(',').map(h => h.trim()),
    versions
  });

export const removeProject = repo => Project.remove({ repo });
