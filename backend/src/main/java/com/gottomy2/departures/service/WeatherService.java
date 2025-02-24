package com.gottomy2.departures.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Cacheable(value = "weatherCache", key = "#city + #date")
    public Double getTemperature(String city, String date) {
        String apiUrl = String.format(
                "https://api.openweathermap.org/data/2.5/weather?q=%s&units=metric&appid=%s",
                city, apiKey
        );

        try {
            Map response = restTemplate.getForObject(apiUrl, Map.class);
            if (response != null && response.containsKey("main")) {
                Map main = (Map) response.get("main");
                return (Double) main.get("temp");
            }
        } catch (Exception e) {
            System.err.println("Błąd podczas pobierania temperatury dla " + city + ": " + e.getMessage());
        }
        return null;
    }
}

