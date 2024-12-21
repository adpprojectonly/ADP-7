package com.taskify.app.controller;

import com.taskify.app.model.Organizations;
import com.taskify.app.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/organizations")
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<List<Organizations>> getAllOrganizations() {
        List<Organizations> organizations = organizationService.getAllOrganizations();
        return ResponseEntity.ok(organizations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Organizations> getOrganizationById(@PathVariable Integer id) {
        Optional<Organizations> organization = organizationService.getOrganizationById(id);
        return organization.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Organizations> createOrganization(@RequestBody Organizations organization) {
        Organizations createdOrganization = organizationService.createOrganization(organization);
        return ResponseEntity.status(201).body(createdOrganization);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Organizations> updateOrganization(@PathVariable Integer id, @RequestBody Organizations organizationDetails) {
        Optional<Organizations> updatedOrganization = organizationService.updateOrganization(id, organizationDetails);
        return updatedOrganization.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Integer id) {
        boolean isDeleted = organizationService.deleteOrganization(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}