package com.bouziane_ilyas.store.cucumber;

import com.bouziane_ilyas.store.ProductorderApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = ProductorderApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
