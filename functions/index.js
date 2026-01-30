const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const {setGlobalOptions} = require("firebase-functions/v2");
const Anthropic = require("@anthropic-ai/sdk");

// Define the secret
const claudeApiKey = defineSecret("CLAUDE_API_KEY");

// Set global options for cost control
setGlobalOptions({maxInstances: 10});

/**
 * Claude chat function for SustainRx AI assistant
 */
exports.chat = onCall(
    {secrets: [claudeApiKey], cors: true},
    async (request) => {
      // Check if user is authenticated
      if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "User must be logged in to use chat",
        );
      }

      const {message, repoContext} = request.data;

      if (!message) {
        throw new HttpsError("invalid-argument", "Message is required");
      }

      try {
        const client = new Anthropic({
          apiKey: claudeApiKey.value(),
        });

        // Build system prompt with repo context if provided
        let systemPrompt = "You are SustainRx AI, a helpful assistant that " +
          "analyzes GitHub repositories and provides insights about code " +
          "health, technical debt, and best practices. You speak in a " +
          "medical/health metaphor - treating code issues as \"symptoms\", " +
          "improvements as \"treatments\", and the codebase as a \"patient\"." +
          "\n\nWhen analyzing commit messages, evaluate whether the message " +
          "accurately describes what the code changes actually do. Consider:" +
          "\n- Does the message describe the scope (how many files/areas)?" +
          "\n- Does it describe the type of change (fix, feature, refactor)?" +
          "\n- Is it specific enough to understand without reading the code?" +
          "\n- Does it follow good commit message conventions?" +
          "\nProvide improved commit message suggestions when appropriate.";

        if (repoContext) {
          systemPrompt += "\n\nRepository Context:\n" +
            `- Name: ${repoContext.name}\n` +
            `- Description: ${repoContext.description || "No description"}\n` +
            `- Stars: ${repoContext.stars}\n` +
            `- Primary Language: ${repoContext.language}\n` +
            `- Open Issues: ${repoContext.openIssues}`;

          // Add recent commits if available
          const commits = repoContext.recentCommits;
          if (commits && commits.length > 0) {
            systemPrompt += "\n\nRecent Commits:\n";
            repoContext.recentCommits.slice(0, 5).forEach((commit) => {
              systemPrompt += `- ${commit.message} (by ${commit.author})\n`;
            });
          }

          // Add file contents if available
          if (repoContext.files && repoContext.files.length > 0) {
            systemPrompt += "\n\nLoaded Source Files:\n";
            repoContext.files.forEach((file) => {
              // Truncate very large files to avoid token limits
              const content = file.content && file.content.length > 8000 ?
                file.content.substring(0, 8000) + "\n... [truncated]" :
                file.content;
              systemPrompt += `\n--- ${file.path} ---\n${content}\n`;
            });
          }
        }

        const response = await client.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{role: "user", content: message}],
        });

        return {
          response: response.content[0].text,
        };
      } catch (error) {
        console.error("Claude API error:", error);
        throw new HttpsError("internal", "Failed to get response from AI");
      }
    },
);
