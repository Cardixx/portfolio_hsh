package com.portfolio.backend.controller;

import com.portfolio.backend.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final FileStorageService fileStorageService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please select a file to upload"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "File must be an image"));
        }

        String fileUrl = fileStorageService.storeFile(file, "images");
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }

    @PostMapping("/video")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please select a video file to upload"));
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("video/") && !contentType.equals("application/octet-stream"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "File must be a video"));
        }

        String fileUrl = fileStorageService.storeFile(file, "videos");
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }
}
