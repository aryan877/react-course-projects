import { STORY_GENRES, STORY_TONES } from "@/lib/constants.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const choiceSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
  },
  text: {
    type: String,
    required: true,
    maxlength: [200, "Choice text cannot exceed 200 characters"],
  },
  selected: {
    type: Boolean,
    default: false,
  },
  consequences: {
    type: String,
    maxlength: [1000, "Consequences cannot exceed 1000 characters"],
  },
});

const storySegmentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
    },
    content: {
      type: String,
      required: true,
      maxlength: [2000, "Story segment cannot exceed 2000 characters"],
    },
    choices: [choiceSchema],
    imageUrl: {
      type: String,
      default: null,
    },
    imagePrompt: {
      type: String,
      default: null,
    },
    parentChoiceId: {
      type: String,
      default: null,
    },
    depth: {
      type: Number,
      default: 0,
      min: 0,
      max: 20, // Maximum story depth
    },
    metadata: {
      generationTime: {
        type: Number, // in milliseconds
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Story title is required"],
      trim: true,
      maxlength: [100, "Story title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Story description cannot exceed 500 characters"],
    },
    initialPrompt: {
      type: String,
      required: [true, "Initial prompt is required"],
      maxlength: [1000, "Initial prompt cannot exceed 1000 characters"],
    },
    genre: {
      type: String,
      enum: STORY_GENRES,
      default: "other",
    },
    tone: {
      type: String,
      enum: STORY_TONES,
      default: "adventurous",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    segments: [storySegmentSchema],
    currentSegmentId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "in-progress", "completed", "abandoned"],
      default: "draft",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
    stats: {
      totalSegments: {
        type: Number,
        default: 0,
      },
      totalChoices: {
        type: Number,
        default: 0,
      },
      averageGenerationTime: {
        type: Number,
        default: 0,
      },
      views: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
    },
    collaboration: {
      isCollaborative: {
        type: Boolean,
        default: false,
      },
      collaborators: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          role: {
            type: String,
            enum: ["editor", "viewer"],
            default: "viewer",
          },
          addedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
storySchema.index({ author: 1, createdAt: -1 });
storySchema.index({ genre: 1, isPublic: 1 });
storySchema.index({ tags: 1 });
storySchema.index({ "segments.id": 1 }, { unique: true, sparse: true });
storySchema.index({ "segments.choices.id": 1 }, { unique: true, sparse: true });

// Virtual for story tree structure
storySchema.virtual("storyTree").get(function () {
  const tree = {};
  this.segments.forEach((segment) => {
    if (segment.parentChoiceId) {
      tree[segment.parentChoiceId] = segment;
    }
  });
  return tree;
});

// Method to get current segment
storySchema.methods.getCurrentSegment = function () {
  return (
    this.segments.find((segment) => segment.id === this.currentSegmentId) ||
    this.segments[0]
  );
};

// Method to add new segment
storySchema.methods.addSegment = function (segmentData) {
  const newSegment = {
    ...segmentData,
    id: uuidv4(),
    depth:
      segmentData.depth ??
      (segmentData.parentChoiceId
        ? (this.segments.find((s) =>
            s.choices.some((c) => c.id === segmentData.parentChoiceId)
          )?.depth || 0) + 1
        : 0),
  };

  this.segments.push(newSegment);
  this.currentSegmentId = newSegment.id;
  this.stats.totalSegments = this.segments.length;
  this.stats.totalChoices = this.segments.reduce(
    (total, segment) => total + segment.choices.length,
    0
  );

  return newSegment;
};

// Method to get story path from root to current segment
storySchema.methods.getStoryPath = function () {
  const path = [];
  let currentSegment = this.getCurrentSegment();

  while (currentSegment) {
    path.unshift(currentSegment);

    if (currentSegment.parentChoiceId) {
      // Find parent segment
      const parentSegment = this.segments.find((segment) =>
        segment.choices.some(
          (choice) => choice.id === currentSegment.parentChoiceId
        )
      );
      currentSegment = parentSegment;
    } else {
      break;
    }
  }

  return path;
};

// Method to check if story is complete (has no more choices)
storySchema.methods.isComplete = function () {
  const currentSegment = this.getCurrentSegment();
  return !currentSegment || currentSegment.choices.length === 0;
};

export default mongoose.model("Story", storySchema);
