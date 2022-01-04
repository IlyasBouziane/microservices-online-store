package com.bouziane_ilyas.store.cucumber;

import com.bouziane_ilyas.store.InvoiceApp;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.web.WebAppConfiguration;

@CucumberContextConfiguration
@SpringBootTest(classes = InvoiceApp.class)
@WebAppConfiguration
public class CucumberTestContextConfiguration {}
