/**
 * GitHub PR Fetcher for Rust & Go Projects
 * 
 * This script fetches PRs from a GitHub user and updates the README.md file
 * with information about Rust and Go related contributions.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  githubUsername: 'dongowu', // Your GitHub username
  readmePath: path.join(__dirname, 'README.md'),
  maxPRsToShow: 5, // Maximum number of PRs to display
};

/**
 * Fetches PRs from GitHub API for a specific user
 * @param {string} username - GitHub username
 * @returns {Promise<Array>} - Array of PR objects
 */
function fetchUserPRs(username) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      // Remove is:public to allow searching private PRs if the token has permissions
      path: `/search/issues?q=author:${username}+type:pr`,
      method: 'GET',
      headers: {
        'User-Agent': 'PR-Fetcher-Script',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          if (res.statusCode !== 200) {
            reject(new Error(`GitHub API Error: ${parsedData.message}`));
            return;
          }
          resolve(parsedData.items || []);
        } catch (error) {
          reject(new Error(`Failed to parse GitHub API response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
    
    req.end();
  });
}

/**
 * Filters PRs to find Rust and Go related contributions
 * @param {Array} prs - Array of PR objects
 * @returns {Array} - Filtered array of Rust/Go-related PRs
 */
function filterRelevantPRs(prs) {
  return prs.filter(pr => {
    // Helper for checking string existence
    const contains = (str, keywords) => {
      if (!str) return false;
      const lower = str.toLowerCase();
      return keywords.some(k => lower.includes(k));
    };

    const rustKeywords = ['rust', 'cargo', 'crate'];
    const goKeywords = ['go', 'golang', 'goroutine'];
    const allKeywords = [...rustKeywords, ...goKeywords];

    // Check repository name/url
    const isRelevantRepo = contains(pr.repository_url, allKeywords);
    
    // Check labels
    const hasRelevantLabel = pr.labels && pr.labels.some(label => 
      contains(label.name, allKeywords)
    );
    
    // Check title and body
    const titleRelevant = contains(pr.title, allKeywords);
    const bodyRelevant = contains(pr.body, allKeywords);
    
    return isRelevantRepo || hasRelevantLabel || titleRelevant || bodyRelevant;
  });
}

/**
 * Formats PR data for README display
 * @param {Array} relevantPRs - Array of Rust/Go-related PRs
 * @returns {string} - Formatted markdown content
 */
function formatPRsForReadme(relevantPRs) {
  if (relevantPRs.length === 0) {
    return '### Open Source Contributions\n- No Rust/Go-related PRs found yet.\n';
  }

  const prItems = relevantPRs
    .slice(0, config.maxPRsToShow)
    .map(pr => {
      const repoName = pr.repository_url.replace('https://api.github.com/repos/', '');
      return `- **[${repoName}](${pr.html_url})**: ${pr.title}`;
    })
    .join('\n');

  return `### Open Source Contributions\n${prItems}\n`;
}

/**
 * Updates the README.md file with PR information
 * @param {string} contributionsSection - Formatted markdown content
 */
function updateReadme(contributionsSection) {
  try {
    let readmeContent = fs.readFileSync(config.readmePath, 'utf8');
    
    // Define the section to replace
    const sectionRegex = /(### Open Source Contributions\n)[\s\S]*?(\n## |$)/;
    
    if (sectionRegex.test(readmeContent)) {
      // Replace existing section
      readmeContent = readmeContent.replace(
        sectionRegex, 
        `$1${contributionsSection.replace('### Open Source Contributions\n', '')}$2`
      );
    } else {
      // Add new section before "Other Featured Projects" or at the end of "Coding Activity"
      // Looking for a good anchor point
      const anchorRegex = /(<!--END_SECTION:waka-->)/;
      if (anchorRegex.test(readmeContent)) {
        readmeContent = readmeContent.replace(
            anchorRegex,
            `$1\n\n${contributionsSection}`
        );
      } else {
         // Fallback to appending if waka section not found (unlikely based on current readme)
         console.error('Could not find a suitable location to insert the contributions section');
         return;
      }
    }
    
    fs.writeFileSync(config.readmePath, readmeContent, 'utf8');
    console.log('README.md updated successfully with Rust & Go PR information!');
  } catch (error) {
    console.error(`Failed to update README: ${error.message}`);
  }
}

/**
 * Main function to run the script
 */
async function main() {
  try {
    console.log(`Fetching PRs for GitHub user: ${config.githubUsername}...`);
    const prs = await fetchUserPRs(config.githubUsername);
    console.log(`Found ${prs.length} total PRs`);
    
    const relevantPRs = filterRelevantPRs(prs);
    console.log(`Found ${relevantPRs.length} Rust/Go-related PRs`);
    
    const contributionsSection = formatPRsForReadme(relevantPRs);
    updateReadme(contributionsSection);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
main();
