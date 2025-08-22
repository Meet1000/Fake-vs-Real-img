# Reality Defender - AI Deepfake Detection

A modern, professional web application for detecting deepfakes and manipulated media using the Reality Defender API. Built with Flask backend and a beautiful, responsive frontend.

## Features

- **Advanced AI Detection**: Powered by Reality Defender's state-of-the-art deepfake detection API
- **Multi-Format Support**: Upload images (JPG, PNG, WEBP) and videos (MP4, AVI, MOV, MKV, WEBM)
- **Real-time Analysis**: Get results in under 2 seconds with detailed confidence scores
- **Modern UI/UX**: Beautiful, responsive design with smooth animations and professional styling
- **Drag & Drop**: Intuitive file upload with drag-and-drop functionality
- **Preview System**: Preview your media before analysis
- **Detailed Reports**: Comprehensive analysis results with probability breakdowns
- **Mobile Optimized**: Fully responsive design for all devices

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: Reality Defender Deepfake Detection API
- **Styling**: Custom CSS with modern design patterns
- **Icons**: Font Awesome 6
- **Fonts**: Inter (Google Fonts)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DeepFake
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure API Key**
   The Reality Defender API key is already configured in the application. If you need to use your own key, update the `REALITY_DEFENDER_API_KEY` variable in `server.py`.

4. **Run the application**
   ```bash
   python server.py
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## Usage

1. **Upload Media**: Drag and drop or click to browse for images or videos
2. **Select Type**: Choose between image or video analysis
3. **Preview**: Review your media before analysis
4. **Analyze**: Click "Analyze Media" to start detection
5. **View Results**: Get detailed results with confidence scores and probabilities
6. **Download Report**: Save analysis results as a text report

## API Integration

The application integrates with the Reality Defender API for deepfake detection:

- **Authentication**: Bearer token authentication
- **File Processing**: Base64 encoding for secure transmission
- **Response Handling**: Comprehensive error handling and result processing
- **Rate Limiting**: Built-in timeout and retry mechanisms

## File Support

### Images
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### Videos
- MP4 (.mp4)
- AVI (.avi)
- MOV (.mov)
- MKV (.mkv)
- WebM (.webm)

**Maximum file size**: 10MB

## Project Structure

```
DeepFake/
├── server.py              # Flask backend server
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
└── web/                  # Frontend assets
    ├── index.html        # Main HTML file
    ├── styles.css        # Modern CSS styling
    └── script.js         # JavaScript functionality
```

## API Endpoints

- `GET /` - Serve the main application
- `GET /api/health` - Health check endpoint
- `POST /api/predict` - Deepfake detection endpoint

## Development

### Backend Development
The Flask server handles:
- File upload and validation
- Reality Defender API integration
- Response processing and formatting
- Error handling and logging

### Frontend Development
The modern frontend includes:
- Responsive design with CSS Grid and Flexbox
- Smooth animations and transitions
- Drag-and-drop file upload
- Real-time progress indicators
- Professional UI components

## Security Features

- **File Validation**: Strict file type and size validation
- **Secure API Calls**: Encrypted communication with Reality Defender
- **Input Sanitization**: Protection against malicious uploads
- **Error Handling**: Graceful error handling without exposing sensitive information

## Performance

- **Fast Loading**: Optimized assets and efficient code
- **Responsive Design**: Works seamlessly on all devices
- **Caching**: Efficient resource loading and caching
- **Compression**: Optimized file sizes for faster transmission

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions about the Reality Defender API integration, please refer to the official Reality Defender documentation.

---

**Built with ❤️ using modern web technologies and AI-powered deepfake detection.**
