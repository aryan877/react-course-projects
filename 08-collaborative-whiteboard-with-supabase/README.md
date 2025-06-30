# Collaborative Whiteboard Application

A beautiful, production-ready real-time collaborative whiteboard application built with React and Supabase.

## Features

### 🎨 Drawing Tools
- **Pen Tool**: Free-hand drawing with customizable brush sizes
- **Shape Tools**: Rectangles, circles, and lines
- **Text Tool**: Add text annotations
- **Color Picker**: 15 predefined colors with visual preview
- **Brush Sizes**: 8 different stroke widths (1px to 20px)

### 👥 Real-time Collaboration
- **Live Cursors**: See other users' cursor positions in real-time
- **Synchronized Drawing**: All drawing actions sync instantly across users
- **User Presence**: View active users with avatars and display names
- **Conflict Resolution**: Smooth handling of simultaneous edits

### 🔐 Authentication & User Management
- **Magic Link Authentication**: Passwordless login via email
- **User Profiles**: Customizable display names and avatar colors
- **Session Management**: Automatic session handling and persistence

### 📱 User Experience
- **Responsive Design**: Optimized for desktop and tablet
- **Undo/Redo**: Full undo/redo functionality
- **Canvas Clearing**: Clear entire canvas with confirmation
- **Shareable URLs**: Each whiteboard has a unique shareable link
- **Auto-save**: All drawings are automatically saved to the database

### 🎭 Design & UI
- **Glass-morphism Interface**: Modern frosted glass effects
- **Smooth Animations**: Micro-interactions and hover states
- **Professional Styling**: Clean, premium aesthetic
- **Floating Toolbars**: Intuitive, non-intrusive controls

## Tech Stack

- **Frontend**: React 19.0.0, Tailwind CSS, Lucide React
- **Backend**: Supabase (PostgreSQL, Real-time, Authentication)
- **Build Tool**: Vite
- **Deployment**: Ready for Netlify, Vercel, or any static host

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-whiteboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create `.env` file from `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   - In your Supabase dashboard, go to the SQL Editor
   - Copy the contents of `supabase/migrations/001_initial_schema.sql`
   - Run the SQL to create tables and policies

5. **Configure authentication**
   - In Supabase dashboard, go to Authentication > Settings
   - Under "Auth Providers", ensure Email is enabled
   - Set your site URL in "Site URL" (e.g., `http://localhost:5173` for development)
   - Disable "Confirm email" if you want immediate access

6. **Start the development server**
   ```bash
   npm run dev
   ```

## Database Schema

### Tables

#### `profiles`
- User profile information
- Links to Supabase auth.users
- Stores display names and avatar colors

#### `whiteboards`
- Whiteboard metadata
- Title, creator, visibility settings
- Timestamps for creation and updates

#### `drawing_elements`
- Individual drawing elements (paths, shapes, text)
- JSONB data for flexibility
- Style information (color, stroke width)
- Creator and timestamp tracking

#### `active_cursors`
- Real-time cursor positions
- Automatic cleanup of stale cursors
- User identification for collaborative features

### Security

- **Row Level Security**: Enabled on all tables
- **Authentication Required**: All operations require valid user session
- **Public Whiteboards**: Users can view/edit public whiteboards
- **Owner Permissions**: Whiteboard creators have full control

## API Endpoints

The application uses Supabase's auto-generated REST API:

- `GET /rest/v1/whiteboards` - List whiteboards
- `POST /rest/v1/whiteboards` - Create whiteboard
- `GET /rest/v1/drawing_elements` - Get drawing elements
- `POST /rest/v1/drawing_elements` - Create drawing element
- `DELETE /rest/v1/drawing_elements` - Delete drawing element
- `GET /rest/v1/active_cursors` - Get active cursors
- `POST /rest/v1/active_cursors` - Update cursor position

Real-time subscriptions are handled via Supabase WebSocket connections.

## Deployment

### Netlify (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Update Supabase settings**
   - Add your production URL to Supabase Auth settings
   - Update redirect URLs as needed

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set environment variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

## Environment Variables

```env
# Required
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Performance Considerations

- **Canvas Optimization**: Uses efficient HTML5 Canvas rendering
- **Real-time Throttling**: Cursor updates limited to 10 events/second
- **Element Batching**: Drawing elements are efficiently batched
- **Connection Management**: Automatic cleanup of stale connections

## Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure token-based authentication
- **XSS Protection**: All user inputs are sanitized
- **CORS Configuration**: Proper cross-origin request handling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the GitHub Issues page
2. Review the Supabase documentation
3. Submit a new issue with detailed information

---

Built with ❤️ using React and Supabase