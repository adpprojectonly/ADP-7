package com.taskify.app.service;

import com.taskify.app.model.Organizations;
import com.taskify.app.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    public List<Organizations> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    public Optional<Organizations> getOrganizationById(Integer id) {
        return organizationRepository.findById(id);
    }

    public Organizations createOrganization(Organizations organization) {
        return organizationRepository.save(organization);
    }

    public Optional<Organizations> updateOrganization(Integer id, Organizations organizationDetails) {
        return organizationRepository.findById(id).map(organization -> {
            organization.setName(organizationDetails.getName());
            return organizationRepository.save(organization);
        });
    }

    public boolean deleteOrganization(Integer id) {
        return organizationRepository.findById(id).map(organization -> {
            organizationRepository.delete(organization);
            return true;
        }).orElse(false);
    }
}